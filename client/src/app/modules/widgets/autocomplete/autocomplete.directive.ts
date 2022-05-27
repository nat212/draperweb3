import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Optional,
  Renderer2,
  Self,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ComponentLoader, ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { AutocompleteContainerComponent } from './autocomplete-container/autocomplete-container.component';
import Fuse from 'fuse.js';
import { NgControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appAutocomplete]',
})
export class AutocompleteDirective<T> implements OnInit {
  private readonly componentLoader: ComponentLoader<AutocompleteContainerComponent<T>>;

  private isShown = false;

  private fuseOpts!: Fuse.IFuseOptions<T>;
  private fuseIndex!: Fuse.FuseIndex<T>;
  private fuse!: Fuse<T>;

  protected matches: T[] = [];

  @Input('appAutocomplete') items: T[] = [];
  @Input() itemTemplate!: TemplateRef<any>;
  @Input() filterKeys: (keyof T)[] = [];
  @Input() limit = 10;

  private hide$ = new Subject<void>();

  constructor(
    componentLoaderFactory: ComponentLoaderFactory,
    protected readonly elementRef: ElementRef<HTMLInputElement>,
    viewContainerRef: ViewContainerRef,
    renderer2: Renderer2,
    @Optional() @Self() protected readonly ngControl: NgControl,
  ) {
    this.componentLoader = componentLoaderFactory.createLoader<AutocompleteContainerComponent<T>>(elementRef, viewContainerRef, renderer2);
  }

  ngOnInit() {
    this.fuseOpts = { keys: this.filterKeys as string[], shouldSort: true };
    this.fuseIndex = Fuse.createIndex(this.fuseOpts.keys!, this.items);
    this.fuse = new Fuse(this.items, this.fuseOpts, this.fuseIndex);
  }

  protected show(items: T[]): void {
    if (!this.isShown) {
      this.componentLoader.attach(AutocompleteContainerComponent).to('body').position({
        attachment: 'bottom left'
      });
      this.isShown = true;
      this.componentLoader.show({ items, activeIndex: 0, itemTemplate: this.itemTemplate });
      this.componentLoader.instance!.itemSelected.pipe(takeUntil(this.hide$)).subscribe((item) => {
        this.selectItem(item);
      });
    } else {
      this.componentLoader.instance!.items = items;
      this.componentLoader.instance!.activeIndex = 0;
    }
  }

  private hide(): void {
    if (this.isShown) {
      this.componentLoader.hide();
      this.isShown = false;
      this.hide$.next();
    }
  }

  protected filter(value: string): T[] {
    this.matches = this.fuse.search(value, { limit: this.limit }).map((i) => i.item);
    return this.matches;
  }

  protected selectItem(item: T) {
    this.hide();
    if (this.ngControl?.control) {
      this.ngControl.control.setValue(item);
    }
  }

  protected get selectedItem(): T | undefined {
    return this.isShown ? this.matches[this.componentLoader.instance!.activeIndex] : undefined;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string | null) {
    if (value) {
      this.filterResults(value);
    } else {
      this.hide();
    }
  }

  @HostListener('keydown.escape', ['$event'])
  onEscapeClick(event: KeyboardEvent) {
    this.hide();
    event.cancelBubble = true;
    event.preventDefault();
    return false;
  }

  @HostListener('blur')
  onBlur() {
    this.hide();
  }

  @HostListener('keydown.arrowUp', ['$event'])
  onArrowUpPress(event: KeyboardEvent) {
    if (!this.isShown) {
      return;
    }
    this.componentLoader.instance!.previous();
    event.cancelBubble = true;
    event.preventDefault();
    return false;
  }

  @HostListener('keydown.arrowDown', ['$event'])
  onArrowDownPress(event: KeyboardEvent) {
    if (!this.isShown) {
      return;
    }
    this.componentLoader.instance!.next();
    event.cancelBubble = true;
    event.preventDefault();
    return false;
  }

  @HostListener('keyup.enter', ['$event'])
  onEnterPress(event: KeyboardEvent) {
    if (!this.isShown) {
      return;
    }
    if (!this.selectedItem) {
      return;
    }
    this.selectItem(this.selectedItem);
    event.cancelBubble = true;
    event.preventDefault();
    return false;
  }

  @HostListener('keydown.tab', ['$event'])
  onTabPress(event: KeyboardEvent) {
    return this.onEnterPress(event);
  }

  protected filterResults(value: string): void {
    const items = this.filter(value);
    if (items.length) {
      this.show(items);
    } else {
      this.hide();
    }
  }
}

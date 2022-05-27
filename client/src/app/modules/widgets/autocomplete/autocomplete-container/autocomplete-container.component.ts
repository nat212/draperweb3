import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-autocomplete-container',
  templateUrl: './autocomplete-container.component.html',
  styleUrls: ['./autocomplete-container.component.scss'],
  host: {
    class: 'dropdown dropdown-menu show',
    style: 'z-index: 10000; margin-left: 16px',
  },
})
export class AutocompleteContainerComponent<T> {
  @Input() public items: T[] = [];
  @Input() public itemTemplate?: TemplateRef<any>;
  @Input() public displayKey?: keyof T;
  @Input() public activeIndex = 0;

  @Output() public itemSelected = new EventEmitter<T>();

  public displayValue(item: T): string {
    return this.displayKey ? item[this.displayKey] : (item as any).toString();
  }

  public previous() {
    this.activeIndex = Math.max(0, this.activeIndex - 1);
  }

  public next() {
    this.activeIndex = Math.min(this.items.length - 1, this.activeIndex + 1);
  }

  onItemHover(index: number) {
    this.activeIndex = index;
  }
}

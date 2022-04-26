import { Directive, ElementRef, Input, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { AutocompleteDirective } from './autocomplete.directive';
import { IModel, Model } from '../../../models/model';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { NgControl } from '@angular/forms';
import { EntityService } from '../../../lib/entity-service';

@Directive({
  selector: '[appEntityAutocomplete]',
})
export class EntityAutocompleteDirective<T extends Model<O>, O extends IModel = IModel> extends AutocompleteDirective<T> {
  @Input('appEntityAutocomplete') service!: EntityService<O, T, any>;

  constructor(
    componentLoaderFactory: ComponentLoaderFactory,
    elementRef: ElementRef<HTMLInputElement>,
    viewContainerRef: ViewContainerRef,
    renderer2: Renderer2,
    @Optional() @Self() ngControl: NgControl,
  ) {
    super(componentLoaderFactory, elementRef, viewContainerRef, renderer2, ngControl);
  }

  override ngOnInit() {
    // Do nothing.
  }

  protected override filterResults(value: string) {
    this.service.getMany({}, value).subscribe((results) => {
      this.matches = results;
      this.show(results);
    });
  }
}

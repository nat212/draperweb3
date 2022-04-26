import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AutocompleteContainerComponent} from "./autocomplete-container/autocomplete-container.component";
import {AutocompleteDirective} from "./autocomplete.directive";
import {EntityAutocompleteDirective} from "./entity-autocomplete.directive";



@NgModule({
  declarations: [AutocompleteContainerComponent, AutocompleteDirective, EntityAutocompleteDirective],
  imports: [
    CommonModule
  ],
  exports: [AutocompleteDirective, EntityAutocompleteDirective],
})
export class AutocompleteModule { }

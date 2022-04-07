import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AutocompleteContainerComponent} from "./autocomplete-container/autocomplete-container.component";
import {AutocompleteDirective} from "./autocomplete.directive";



@NgModule({
  declarations: [AutocompleteContainerComponent, AutocompleteDirective],
  imports: [
    CommonModule
  ],
  exports: [AutocompleteDirective],
})
export class AutocompleteModule { }

import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {AddressAutocompleteComponent} from './address-autocomplete.component';
import {ExampleComponent} from './example.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [ExampleComponent, AddressAutocompleteComponent],
  bootstrap: [ExampleComponent],
  providers: []
})
export class Example {
}

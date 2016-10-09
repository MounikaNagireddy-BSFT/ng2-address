import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {AddressAutocompleterComponent} from './address-autocompleter.component';
import {ExampleComponent} from './example.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [ExampleComponent, AddressAutocompleterComponent],
  bootstrap: [ExampleComponent],
  providers: []
})
export class Example {
}

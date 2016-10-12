import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {AddressAutocompleterComponent} from './address-autocompleter.component';
import {ExampleComponent} from './example.component';
import {FocusDirective} from './focus-directive';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [ExampleComponent, AddressAutocompleterComponent, FocusDirective],
  bootstrap: [ExampleComponent],
  providers: []
})
export class Example {
}

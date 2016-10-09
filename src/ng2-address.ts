import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {AddressAutocompleteComponent} from './address-autocomplete.component';
import {GooglePlacesAutocompleteService} from './google-places-autocomplete.service';
import {FocusDirective} from './focus-directive';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AddressAutocompleteComponent, FocusDirective],
  bootstrap: [AddressAutocompleteComponent],
  providers: [GooglePlacesAutocompleteService]
})
export class AddressAutoCompleter {
}

import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {AddressAutocompleterComponent} from './address-autocompleter.component';
import {GooglePlacesAutocompleteService} from './google-places-autocomplete.service';
import {FocusDirective} from './focus-directive';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AddressAutocompleterComponent, FocusDirective],
  bootstrap: [AddressAutocompleterComponent],
  providers: [GooglePlacesAutocompleteService]
})
export class AddressAutoCompleter {
}

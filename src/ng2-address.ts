import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AddressAutocompleteComponent} from './address-autocomplete.component';
import {GooglePlacesAutocompleteService} from './google-places-autocomplete.service';

@NgModule({
  imports: [BrowserModule],
  declarations: [AddressAutocompleteComponent],
  bootstrap: [AddressAutocompleteComponent],
  providers: [GooglePlacesAutocompleteService]
})
export class AppModule {
}

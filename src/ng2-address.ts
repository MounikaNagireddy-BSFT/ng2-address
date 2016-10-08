import {AddressAutocompleteComponent} from './address-autocomplete.component';
import {Address} from './address';
import {PlaceDetails} from './place-details';
import {PlaceSuggestion} from './place-suggestion';
import {GooglePlacesAutocompleteService} from './google-places-autocomplete.service';

import {NgModule} from '@angular/core';

@NgModule({
  imports: [],
  declarations: [
      AddressAutocompleteComponent,
      Address,
      PlaceDetails,
      PlaceSuggestion],
  bootstrap: [AddressAutocompleteComponent],
  providers: [GooglePlacesAutocompleteService]
})
export class AppModule {
}

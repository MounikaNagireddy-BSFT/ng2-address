import {Component, ApplicationRef, Inject} from "angular2/core";
import {AddressAutocompleteComponent} from './address-autocomplete.component';
import {SnappCarAddressComponent} from './snappcar-address.component';
import {PlaceSuggestion} from './place-suggestion';

@Component({
  selector: 'my-app',
  templateUrl: 'templates/app.tpl.html',
  directives: [AddressAutocompleteComponent]
})
export class AppComponent {
  private address: any;

  constructor(
    @Inject(ApplicationRef) private applicationRef: ApplicationRef
  ) {}

  onAddress(address: any) {
    this.address = address;
    this.applicationRef.tick();
  }
}

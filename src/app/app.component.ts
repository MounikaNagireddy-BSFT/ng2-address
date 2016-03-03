import {Component, ApplicationRef, Inject} from "angular2/core";
import {AddressAutocompleteComponent} from './address-autocomplete.component';
import {SnappCarAddressComponent} from './snappcar-address.component';
import {PlaceSuggestion} from './placeSuggestion';

interface Address {
  street?: string;
  number?: number;
  toString(): string;
}

@Component({
  selector: 'my-app',
  templateUrl: 'templates/app.tpl.html',
  directives: [AddressAutocompleteComponent, SnappCarAddressComponent]
})
export class AppComponent {
  private addressOutput: HTMLDivElement;
  private applicationRef: ApplicationRef;
  private address: string;
  private placesService : any;

  constructor(
    @Inject(ApplicationRef) applicationRef: ApplicationRef) {
    this.applicationRef = applicationRef;
  }

  ngOnInit() {
    var addressOutput = <HTMLDivElement>document.querySelector('#place-test');
    this.placesService = new google.maps.places.PlacesService(addressOutput);
  }

  onSelectAddress($event: PlaceSuggestion) {
    console.log($event);

  }
}

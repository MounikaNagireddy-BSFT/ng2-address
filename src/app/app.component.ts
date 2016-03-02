import {Component} from 'angular2/core';
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
  addressOutput: HTMLDivElement;

  ngOnInit (){
    this.addressOutput = <HTMLDivElement>document.querySelector('#place-test');
  }

  public address: Address = {
    toString: () => `${this.address.street || ''}, ${this.address.number || ''}`
  };

  onSelectAddress ($event : PlaceSuggestion) {
    if(!$event){
      return;
    }

    var placeId = $event.place_id;
    var placeService = new google.maps.places.PlacesService(this.addressOutput);

    placeService.getDetails({
      placeId: placeId
    }, function(placeResult, status) {
      this.address = placeResult
    }.bind(this));
  }
}

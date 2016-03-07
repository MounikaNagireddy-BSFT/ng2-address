import { Injectable } from 'angular2/core';
import { PlaceSuggestion } from './place-suggestion';
import { PlaceDetails } from './place-details';
import { IAutocompleteService } from './autocomplete-service';

// Service that wraps the google autocomplete service.
// https://developers.google.com/maps/documentation/javascript/reference#AutocompleteService

@Injectable()
export class GooglePlacesAutocompleteService implements IAutocompleteService {
  private _autoCompleteOpts: google.maps.places.AutocompleteOptions;
  private _googleAutocomplete: google.maps.places.AutocompleteService;

  public country: string;

  constructor() {
    this._googleAutocomplete = new google.maps.places.AutocompleteService();
    this._autoCompleteOpts = {
      types: ['address']
    };

    this.country = 'NL'; // Default.
  }

  getSuggestions(str: string): Promise<PlaceSuggestion[]> {

    let options = Object.assign({
      input: str,
      componentRestrictions: {
        country: this.country
      }
    }, this._autoCompleteOpts);

    return new Promise<PlaceSuggestion[]>(resolve =>
      this._googleAutocomplete.getPlacePredictions(options, (results: google.maps.places.AutocompletePrediction[], status: google.maps.places.PlacesServiceStatus) => {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
          let suggestions = results.map(r => this.parseGooglePrediction(r));
          resolve(suggestions);
        } else {
          resolve([]);
        }
      })
    );
  }

  getSuggestionDetails(id: string): Promise<PlaceDetails>{
    let service = new google.maps.places.PlacesService(document.createElement('div'));

    return new Promise<PlaceDetails>(resolve =>
        service.getDetails({
            placeId: id
        }, (placeResult: google.maps.places.PlaceResult, status) => {
            let address = this.parseGooglePlaceResult(placeResult);
            resolve(address);
        })
  );
  }

  private parseGooglePrediction (googleResult: google.maps.places.AutocompletePrediction) : PlaceSuggestion {
    let suggestion = new PlaceSuggestion();

    suggestion.description = googleResult.description;
    suggestion.id = googleResult.place_id;

    return suggestion;
  }

  /**
   * Map google result to PlaceDetail object
   */
  private parseGooglePlaceResult(placeResult : google.maps.places.PlaceResult) : PlaceDetails{
      const map : any = placeResult.address_components.reduce((mapping, addrComponent) => {
        mapping[addrComponent.types[0]] = addrComponent.long_name;
        return mapping;
      }, {});

      let placeDetail = new PlaceDetails();

      placeDetail.id = placeResult.place_id;

      placeDetail.address = {
        street : map.route,
        houseNumber: map.street_number,
        postalCode: map.postal_code || map.postal_code_prefix,
        city: map.locality,
        country: map.country
      };

      return placeDetail;
  }
}

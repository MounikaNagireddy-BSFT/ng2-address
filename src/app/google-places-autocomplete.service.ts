import { Injectable } from 'angular2/core';
import { PlaceSuggestion } from './place-suggestion';
import { PlaceDetails } from './place-details';
import { IAutocompleteService } from './autocomplete-service';

// Service that wraps the google autocomplete service.
// https://developers.google.com/maps/documentation/javascript/reference#AutocompleteService

@Injectable()
export class GooglePlacesAutocompleteService implements IAutocompleteService {
  private _googleAutocomplete: google.maps.places.AutocompleteService;

  public country: string;

  constructor() {
    this._googleAutocomplete = new google.maps.places.AutocompleteService();
    this.country = 'NL'; // Default.
  }

  getSuggestions(str: string): Promise<PlaceSuggestion[]> {

    let request: google.maps.places.AutocompletionRequest = {
      input: str,
      componentRestrictions: {
        country: this.country
      },
      types: ['address']
    };

    return new Promise<PlaceSuggestion[]>((resolve, reject) =>
      this._googleAutocomplete.getPlacePredictions(request, (results, status) => {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
          let suggestions = results.map(r => this.parseGooglePrediction(r));
          resolve(suggestions);
        } else {
          reject(status);
        }
      })
    );
  }

  /**
   * Get place details based on google place_id.
   */
  getSuggestionDetails(id: string): Promise<PlaceDetails>{
    // The google PlacesService somehow needs an HTMLDivElement as an argument. Create a dummy div.
    let service = new google.maps.places.PlacesService(document.createElement('div'));

    return new Promise<PlaceDetails>((resolve, reject) =>
        service.getDetails({
            placeId: id
        }, (placeResult: google.maps.places.PlaceResult, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              let address = this.parseGooglePlaceResult(placeResult);
              resolve(address);
            } else{
              reject();
            }
        })
  );
  }

  /**
   * Map google result to PlaceSuggestion object
   */
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
      // For convenience first create a map of the google address components. ie: { 'locality' : 'Utrecht', ... }
      const map : any = placeResult.address_components.reduce((map, addrComponent) => {
        map[addrComponent.types[0]] = addrComponent.long_name;
        return map;
      }, {});

      console.log(placeResult, map);

      let placeDetail = new PlaceDetails(placeResult.place_id);

      placeDetail.address = {
        street : map.route,
        houseNumber: map.street_number,
        postalCode: map.postal_code,
        city: map.locality,
        country: map.country
      };

      return placeDetail;
  }
}

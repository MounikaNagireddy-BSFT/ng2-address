import { Injectable } from '@angular/core';
import { PlaceSuggestion, PlaceType } from './place-suggestion';
import { PlaceDetails } from './place-details';
import { IAutocompleteService } from './autocomplete-service';
import { Address } from './address';

// Service that wraps the google autocomplete service.
// https://developers.google.com/maps/documentation/javascript/reference#AutocompleteService

@Injectable()
export class GooglePlacesAutocompleteService implements IAutocompleteService {
  public country: string;

  private _googlePlacesService: google.maps.places.PlacesService;
  private _googleAutocomplete: google.maps.places.AutocompleteService;

  constructor() {
    // The google PlacesService somehow needs an HTMLDivElement as an argument. Create a dummy div.
    this._googlePlacesService = new google.maps.places.PlacesService(document.createElement('div'));
    this._googleAutocomplete = new google.maps.places.AutocompleteService();
    this.country = 'NL'; // Default.
  }

  getSuggestions(str: string): Promise<PlaceSuggestion[]> {

    const request: google.maps.places.AutocompletionRequest = {
      input: str,
      componentRestrictions: {
        country: this.country
      },
      types: ['address']
    };

    return new Promise<PlaceSuggestion[]>((resolve, reject) => {
      this._googleAutocomplete.getPlacePredictions(request, (results, status) => {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const suggestions = results.map(r => this.parseGooglePrediction(r));
          resolve(suggestions);
        } else {
          reject(status);
        }
      });
    });
  }

  /**
   * Get place details based on google place_id.
   */
  getSuggestionDetails(id: string): Promise<PlaceDetails> {

    return new Promise<PlaceDetails>((resolve, reject) =>
      this._googlePlacesService.getDetails({
        placeId: id
      }, (placeResult: google.maps.places.PlaceResult, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const address = this.parseGooglePlaceResult(placeResult);
            resolve(address);
          } else {
            reject(status);
          }
        })
      );
  }

  /**
   * Map google result to PlaceSuggestion object
   */
  private parseGooglePrediction(googleResult: google.maps.places.AutocompletePrediction): PlaceSuggestion {
    const suggestion = new PlaceSuggestion();

    suggestion.description = googleResult.description;
    suggestion.id = googleResult.place_id;
    suggestion.type = PlaceType[googleResult.types[0]];

    return suggestion;
  }

  /**
   * Map google result to PlaceDetail object
   */
  private parseGooglePlaceResult(placeResult: google.maps.places.PlaceResult): PlaceDetails {
    // For convenience first create a map of the google address components. ie: { 'locality' : 'Utrecht', ... }
    const map: any = placeResult.address_components.reduce((map, addrComponent) => {
      map[addrComponent.types[0]] = addrComponent.long_name;
      return map;
    }, {});

    const placeDetail = new PlaceDetails(placeResult.place_id);

    // Copy fields to the address object.
    Object.assign(placeDetail.address, {
      street: map.route,
      houseNumber: map.street_number,
      postalCode: map.postal_code,
      city: map.locality,
      country: map.country,
      coords: {
        lat: placeResult.geometry.location.lat(),
        lng: placeResult.geometry.location.lng()
      }
    });

    return placeDetail;
  }
}

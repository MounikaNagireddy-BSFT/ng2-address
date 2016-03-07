import { Injectable } from 'angular2/core';
import { PlaceSuggestion } from './place-suggestion';
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
    let query = Object.assign({
      input: str,
      componentRestrictions: {
        country: this.country
      }
    }, this._autoCompleteOpts);

    return new Promise<PlaceSuggestion[]>(resolve =>
      this._googleAutocomplete.getPlacePredictions(query, (results: google.maps.places.AutocompletePrediction[], status: google.maps.places.PlacesServiceStatus) => {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
          var suggestions = results.map(r => this.googleResultToSuggestion(r));
          resolve(suggestions);
        } else {
          resolve([]);
        }
      })
    );
  }

  private googleResultToSuggestion (googleResult: google.maps.places.AutocompletePrediction) : PlaceSuggestion {
    let suggestion = new PlaceSuggestion();

    suggestion.description = googleResult.description;
    suggestion.id = googleResult.place_id;

    return suggestion;
  }
}

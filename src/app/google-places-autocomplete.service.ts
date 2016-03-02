import { Injectable } from 'angular2/core';
import { PlaceSuggestion } from './placeSuggestion';

// Service that wraps the google autocomplete service.
// https://developers.google.com/maps/documentation/javascript/reference#AutocompleteService

export interface AutoSuggestService {
  getSuggestions(s: string);
}

@Injectable()
export class GooglePlacesAutocompleteService implements AutoSuggestService {
  private _googleAutocomplete: google.maps.places.AutocompleteService;
  private _autoCompleteOpts: google.maps.places.AutocompleteOptions;

  constructor() {
    this._googleAutocomplete = new google.maps.places.AutocompleteService();

    this._autoCompleteOpts = {
      componentRestrictions: {
        country: 'NL'
      },
      types: ['address']
    };
  }

  getSuggestions(str: string): Promise<PlaceSuggestion[]> {
    var query = Object.assign({
      input: str
    }, this._autoCompleteOpts);

    return new Promise<PlaceSuggestion[]>(resolve =>
      this._googleAutocomplete.getPlacePredictions(query, (results: google.maps.places.AutocompletePrediction[], status: google.maps.places.PlacesServiceStatus) => {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
          var suggestions = results.map(r => new PlaceSuggestion(r));
          resolve(suggestions);
        } else {
          resolve([]);
        }
      })
      );
  }
}

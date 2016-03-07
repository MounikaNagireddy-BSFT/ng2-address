import { PlaceSuggestion } from './place-suggestion';
import { PlaceDetails } from './place-details';

export interface IAutocompleteService {
  country: string;
  getSuggestions(query: string): Promise<PlaceSuggestion[]>;
  getSuggestionDetails(str: string): Promise<PlaceDetails>;
}

import { PlaceSuggestion } from './place-suggestion';

export interface IAutocompleteService {
  country: string;
  getSuggestions(query: string): Promise<PlaceSuggestion[]>;
}

declare module "place-suggestion" {
    export class PlaceSuggestion {
        id: string;
        description: string;
        type: PlaceType;
        toString(): string;
    }
    export enum PlaceType {
        StreetAddress = 0,
        Route = 1,
    }
}
declare module "address" {
    export class Address {
        street: string;
        houseNumber: string;
        postalCode: string;
        city: string;
        country: string;
        coords: {
            lat: number;
            lng: number;
        };
        toString(): string;
        isComplete(): boolean;
    }
}
declare module "place-details" {
    import { Address } from "address";
    export class PlaceDetails {
        id: string;
        address: Address;
        constructor(id?: string);
    }
}
declare module "autocomplete-service" {
    import { PlaceSuggestion } from "place-suggestion";
    import { PlaceDetails } from "place-details";
    export interface IAutocompleteService {
        country: string;
        getSuggestions(query: string): Promise<PlaceSuggestion[]>;
        getSuggestionDetails(str: string): Promise<PlaceDetails>;
    }
}
declare module "google-places-autocomplete.service" {
    import { PlaceSuggestion } from "place-suggestion";
    import { PlaceDetails } from "place-details";
    import { IAutocompleteService } from "autocomplete-service";
    export class GooglePlacesAutocompleteService implements IAutocompleteService {
        country: string;
        private _googlePlacesService;
        private _googleAutocomplete;
        constructor();
        getSuggestions(str: string): Promise<PlaceSuggestion[]>;
        /**
         * Get place details based on google place_id.
         */
        getSuggestionDetails(id: string): Promise<PlaceDetails>;
        /**
         * Map google result to PlaceSuggestion object
         */
        private parseGooglePrediction(googleResult);
        /**
         * Map google result to PlaceDetail object
         */
        private parseGooglePlaceResult(placeResult);
    }
}
declare module "address-autocomplete.component" {
    import { EventEmitter } from 'angular2/core';
    import { GooglePlacesAutocompleteService } from "google-places-autocomplete.service";
    import { Address } from "address";
    export class AddressAutocompleteComponent {
        onAddress: EventEmitter<Address>;
        placeholderStreet: string;
        placeholderHouseNumber: string;
        placeholderPostalCode: string;
        country: string;
        address: Address;
        private autoCompleteService;
        private selectedSuggestion;
        private suggestions;
        private inputString;
        private manualHouseNumber;
        private manualPostalCode;
        constructor(autoCompleteService: GooglePlacesAutocompleteService);
        private ngOnInit();
        private ngOnChanges(changes);
        private onKeyUp(keyCode, fieldStreet);
        private showSuggestions(str);
        /**
         * Use arrow keys to select previous or next suggestion
         */
        private updateSuggestionSelection(keyCode);
        /**
         * When the user
         */
        private useCurrentSuggestion();
        private onBlurHouseNumber(houseNumber);
        private onBlurPostalCode(postalCode);
    }
}
declare module "ng2-address" {
    export * from "address-autocomplete.component";
    export * from "address";
    export * from "autocomplete-service";
    export * from "google-places-autocomplete.service";
    export * from "place-details";
    export * from "place-suggestion";
}

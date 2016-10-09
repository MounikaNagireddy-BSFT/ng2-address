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
    import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
    import { GooglePlacesAutocompleteService } from "google-places-autocomplete.service";
    import { Address } from "address";
    export class AddressAutocompleteComponent implements OnInit, OnChanges {
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
        ngOnInit(): void;
        ngOnChanges(changes: SimpleChanges): void;
        onKeyUp(keyCode: number, fieldStreet: HTMLInputElement): void;
        private onChangeInput(str, inputField);
        private scrollToElement(element);
        /**
         * Use arrow keys to select previous or next suggestion
         */
        private updateSuggestionSelection(keyCode);
        private onBlurStreet();
        private useSuggestion(suggestion);
        private onBlurHouseNumber(houseNumber);
        private onBlurPostalCode(postalCode);
    }
}
declare module "focus-directive" {
    import { AfterViewInit, ElementRef, Renderer } from '@angular/core';
    export class FocusDirective implements AfterViewInit {
        private el;
        constructor(el: ElementRef, renderer: Renderer);
        ngAfterViewInit(): void;
    }
}
declare module "address-auto-completer.module" {
    export class AddressAutoCompleter {
    }
}

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
System.register("place-suggestion", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var PlaceSuggestion, PlaceType;
    return {
        setters:[],
        execute: function() {
            PlaceSuggestion = (function () {
                function PlaceSuggestion() {
                }
                PlaceSuggestion.prototype.toString = function () {
                    return this.description;
                };
                return PlaceSuggestion;
            }());
            exports_1("PlaceSuggestion", PlaceSuggestion);
            (function (PlaceType) {
                PlaceType[PlaceType["StreetAddress"] = 0] = "StreetAddress";
                PlaceType[PlaceType["Route"] = 1] = "Route";
            })(PlaceType || (PlaceType = {}));
            exports_1("PlaceType", PlaceType);
        }
    }
});
System.register("address", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Address;
    return {
        setters:[],
        execute: function() {
            Address = (function () {
                function Address() {
                }
                Address.prototype.toString = function () {
                    var _this = this;
                    // Get all *filled* fields from this object and concatenate them.
                    return ['street', 'houseNumber', 'city', 'country']
                        .map(function (k) { return _this[k]; }) // Get all values for given keys
                        .filter(function (v) { return !!v; }) // Check if the value is truthy (not null/undefined/empty string)
                        .join(' ');
                };
                Address.prototype.isComplete = function () {
                    var _this = this;
                    return ['street', 'houseNumber', 'city', 'postalCode', 'country']
                        .every(function (k) { return !!_this[k]; });
                };
                return Address;
            }());
            exports_2("Address", Address);
        }
    }
});
System.register("place-details", ["address"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var address_1;
    var PlaceDetails;
    return {
        setters:[
            function (address_1_1) {
                address_1 = address_1_1;
            }],
        execute: function() {
            PlaceDetails = (function () {
                function PlaceDetails(id) {
                    this.id = id;
                    this.address = new address_1.Address();
                }
                return PlaceDetails;
            }());
            exports_3("PlaceDetails", PlaceDetails);
        }
    }
});
System.register("autocomplete-service", [], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("google-places-autocomplete.service", ['@angular/core', "place-suggestion", "place-details"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var core_1, place_suggestion_1, place_details_1;
    var GooglePlacesAutocompleteService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (place_suggestion_1_1) {
                place_suggestion_1 = place_suggestion_1_1;
            },
            function (place_details_1_1) {
                place_details_1 = place_details_1_1;
            }],
        execute: function() {
            // Service that wraps the google autocomplete service.
            // https://developers.google.com/maps/documentation/javascript/reference#AutocompleteService
            GooglePlacesAutocompleteService = (function () {
                function GooglePlacesAutocompleteService() {
                    // The google PlacesService somehow needs an HTMLDivElement as an argument. Create a dummy div.
                    this._googlePlacesService = new google.maps.places.PlacesService(document.createElement('div'));
                    this._googleAutocomplete = new google.maps.places.AutocompleteService();
                    this.country = 'NL'; // Default.
                }
                GooglePlacesAutocompleteService.prototype.getSuggestions = function (str) {
                    var _this = this;
                    var request = {
                        input: str,
                        componentRestrictions: {
                            country: this.country
                        },
                        types: ['address']
                    };
                    return new Promise(function (resolve, reject) {
                        _this._googleAutocomplete.getPlacePredictions(request, function (results, status) {
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                var suggestions = results.map(function (r) { return _this.parseGooglePrediction(r); });
                                resolve(suggestions);
                            }
                            else {
                                reject(status);
                            }
                        });
                    });
                };
                /**
                 * Get place details based on google place_id.
                 */
                GooglePlacesAutocompleteService.prototype.getSuggestionDetails = function (id) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        return _this._googlePlacesService.getDetails({
                            placeId: id
                        }, function (placeResult, status) {
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                var address = _this.parseGooglePlaceResult(placeResult);
                                resolve(address);
                            }
                            else {
                                reject(status);
                            }
                        });
                    });
                };
                /**
                 * Map google result to PlaceSuggestion object
                 */
                GooglePlacesAutocompleteService.prototype.parseGooglePrediction = function (googleResult) {
                    var suggestion = new place_suggestion_1.PlaceSuggestion();
                    suggestion.description = googleResult.description;
                    suggestion.id = googleResult.place_id;
                    suggestion.type = place_suggestion_1.PlaceType[googleResult.types[0]];
                    return suggestion;
                };
                /**
                 * Map google result to PlaceDetail object
                 */
                GooglePlacesAutocompleteService.prototype.parseGooglePlaceResult = function (placeResult) {
                    // For convenience first create a map of the google address components. ie: { 'locality' : 'Utrecht', ... }
                    var map = placeResult.address_components.reduce(function (map, addrComponent) {
                        map[addrComponent.types[0]] = addrComponent.long_name;
                        return map;
                    }, {});
                    var placeDetail = new place_details_1.PlaceDetails(placeResult.place_id);
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
                };
                GooglePlacesAutocompleteService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], GooglePlacesAutocompleteService);
                return GooglePlacesAutocompleteService;
            }());
            exports_5("GooglePlacesAutocompleteService", GooglePlacesAutocompleteService);
        }
    }
});
System.register("address-autocomplete.component", ['@angular/core', "google-places-autocomplete.service"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var core_2, google_places_autocomplete_service_1;
    var KEYS, AddressAutocompleteComponent;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (google_places_autocomplete_service_1_1) {
                google_places_autocomplete_service_1 = google_places_autocomplete_service_1_1;
            }],
        execute: function() {
            KEYS = {
                ARROW_UP: 38,
                ARROW_DOWN: 40,
                ENTER: 13
            };
            AddressAutocompleteComponent = (function () {
                function AddressAutocompleteComponent(autoCompleteService) {
                    this.onAddress = new core_2.EventEmitter();
                    this.autoCompleteService = autoCompleteService;
                    this.suggestions = [];
                }
                AddressAutocompleteComponent.prototype.ngOnInit = function () {
                    this.autoCompleteService.country = 'DE'; // this.country;
                };
                AddressAutocompleteComponent.prototype.ngOnChanges = function (changes) {
                    if (changes['country']) {
                        this.autoCompleteService.country = changes['country'].currentValue;
                        this.inputString = null;
                        this.address = null;
                    }
                };
                AddressAutocompleteComponent.prototype.onKeyUp = function (keyCode, fieldStreet) {
                    if (keyCode === KEYS.ENTER) {
                        fieldStreet.blur();
                        return;
                    }
                    // On pressing up or down
                    if (keyCode === KEYS.ARROW_UP || keyCode === KEYS.ARROW_DOWN) {
                        if (this.suggestions.length) {
                            this.updateSuggestionSelection(keyCode);
                            this.inputString = this.selectedSuggestion.description;
                        }
                        return;
                    }
                    this.onChangeInput(fieldStreet.value, fieldStreet);
                };
                AddressAutocompleteComponent.prototype.onChangeInput = function (str, inputField) {
                    var _this = this;
                    // User cleared the input field, or this is the first key pressed (which isnt a
                    // character).
                    if (!str) {
                        this.selectedSuggestion = null;
                        this.suggestions = [];
                        return;
                    }
                    this
                        .autoCompleteService
                        .getSuggestions(str)
                        .then(function (results) {
                        _this.suggestions = results;
                        _this.selectedSuggestion = results[0];
                        // On mobile, scroll input element to the top, so the suggestions are more
                        // visible.
                        if ('ontouchstart' in window) {
                            _this.scrollToElement(inputField);
                        }
                    })
                        .catch(function (status) {
                        _this.suggestions = [];
                        _this.selectedSuggestion = null;
                    });
                };
                // Scroll element to top on touchscreens, to make place for suggestion list.
                AddressAutocompleteComponent.prototype.scrollToElement = function (element) {
                    var curtop = 0;
                    while (element) {
                        curtop += element.offsetTop;
                        element = element.offsetParent;
                    }
                    window.scrollTo(0, curtop);
                };
                /**
                 * Use arrow keys to select previous or next suggestion
                 */
                AddressAutocompleteComponent.prototype.updateSuggestionSelection = function (keyCode) {
                    var selectedIndex = this.suggestions.indexOf(this.selectedSuggestion);
                    if (keyCode === KEYS.ARROW_DOWN) {
                        selectedIndex++;
                    }
                    else if (keyCode === KEYS.ARROW_UP) {
                        selectedIndex--;
                    }
                    // Clamping selection between 0 and num suggestions.
                    selectedIndex = Math.min(this.suggestions.length - 1, Math.max(0, selectedIndex));
                    this.selectedSuggestion = this.suggestions[selectedIndex];
                };
                AddressAutocompleteComponent.prototype.onBlurStreet = function () {
                    if (this.selectedSuggestion) {
                        this.useSuggestion(this.selectedSuggestion);
                    }
                };
                AddressAutocompleteComponent.prototype.useSuggestion = function (suggestion) {
                    var _this = this;
                    // Replace input field with current selected suggestion.
                    this.inputString = suggestion.description;
                    // Clear current suggestion list
                    this.suggestions = [];
                    // Get the address details (components) based on the google placeid
                    var placeId = suggestion.id;
                    return this
                        .autoCompleteService
                        .getSuggestionDetails(placeId)
                        .then(function (placeDetail) {
                        var address = placeDetail.address;
                        if (_this.address && (address.toString() !== _this.address.toString())) {
                            // remove manual housenumber, postalcode override
                            _this.manualHouseNumber = '';
                            _this.manualPostalCode = '';
                        }
                        _this.address = address;
                        _this
                            .onAddress
                            .emit(address);
                    });
                };
                AddressAutocompleteComponent.prototype.onBlurHouseNumber = function (houseNumber) {
                    var _this = this;
                    this
                        .autoCompleteService
                        .getSuggestions(houseNumber + " " + this.inputString)
                        .then(function (results) {
                        var bestSuggestion = results[0];
                        _this
                            .autoCompleteService
                            .getSuggestionDetails(bestSuggestion.id)
                            .then(function (placeDetail) {
                            // The new suggestion is based on street + housenumber. In 99% of the cases this
                            // means the autocomplete engine found an postalcode as well.
                            if (placeDetail.address.isComplete()) {
                                _this.useSuggestion(bestSuggestion);
                            }
                            else {
                                _this.manualHouseNumber = houseNumber;
                                _this.address.houseNumber = houseNumber;
                                _this
                                    .onAddress
                                    .emit(_this.address);
                            }
                        });
                    });
                };
                AddressAutocompleteComponent.prototype.onBlurPostalCode = function (postalCode) {
                    if (postalCode) {
                        this.manualPostalCode = postalCode;
                        this.address.postalCode = postalCode;
                        this
                            .onAddress
                            .emit(this.address);
                    }
                };
                __decorate([
                    core_2.Output(), 
                    __metadata('design:type', Object)
                ], AddressAutocompleteComponent.prototype, "onAddress", void 0);
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', String)
                ], AddressAutocompleteComponent.prototype, "placeholderStreet", void 0);
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', String)
                ], AddressAutocompleteComponent.prototype, "placeholderHouseNumber", void 0);
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', String)
                ], AddressAutocompleteComponent.prototype, "placeholderPostalCode", void 0);
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', String)
                ], AddressAutocompleteComponent.prototype, "country", void 0);
                AddressAutocompleteComponent = __decorate([
                    core_2.Component({
                        selector: 'ng2-address-autocomplete',
                        templateUrl: 'address-autocomplete.component.html',
                        styles: ["\n      .selected {\n        background-color: hsla(200, 100%, 50%, 0.2);\n      }\n  "],
                        providers: [google_places_autocomplete_service_1.GooglePlacesAutocompleteService]
                    }), 
                    __metadata('design:paramtypes', [google_places_autocomplete_service_1.GooglePlacesAutocompleteService])
                ], AddressAutocompleteComponent);
                return AddressAutocompleteComponent;
            }());
            exports_6("AddressAutocompleteComponent", AddressAutocompleteComponent);
        }
    }
});
System.register("focus-directive", ['@angular/core'], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var core_3;
    var FocusDirective;
    return {
        setters:[
            function (core_3_1) {
                core_3 = core_3_1;
            }],
        execute: function() {
            // http://stackoverflow.com/questions/34502768/why-angular2-template-local-variables-are-not-usable-in-templates-when-using-ng
            FocusDirective = (function () {
                function FocusDirective(el, renderer) {
                    this.el = el;
                }
                FocusDirective.prototype.ngAfterViewInit = function () {
                    this.el.nativeElement.focus();
                };
                FocusDirective = __decorate([
                    core_3.Directive({ selector: '[focusOnInit]' }), 
                    __metadata('design:paramtypes', [core_3.ElementRef, core_3.Renderer])
                ], FocusDirective);
                return FocusDirective;
            }());
            exports_7("FocusDirective", FocusDirective);
        }
    }
});
System.register("ng2-address", ['@angular/core', '@angular/forms', '@angular/platform-browser', "address-autocomplete.component", "google-places-autocomplete.service", "focus-directive"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var core_4, forms_1, platform_browser_1, address_autocomplete_component_1, google_places_autocomplete_service_2, focus_directive_1;
    var AppModule;
    return {
        setters:[
            function (core_4_1) {
                core_4 = core_4_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (address_autocomplete_component_1_1) {
                address_autocomplete_component_1 = address_autocomplete_component_1_1;
            },
            function (google_places_autocomplete_service_2_1) {
                google_places_autocomplete_service_2 = google_places_autocomplete_service_2_1;
            },
            function (focus_directive_1_1) {
                focus_directive_1 = focus_directive_1_1;
            }],
        execute: function() {
            AppModule = (function () {
                function AppModule() {
                }
                AppModule = __decorate([
                    core_4.NgModule({
                        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule],
                        declarations: [address_autocomplete_component_1.AddressAutocompleteComponent, focus_directive_1.FocusDirective],
                        bootstrap: [address_autocomplete_component_1.AddressAutocompleteComponent],
                        providers: [google_places_autocomplete_service_2.GooglePlacesAutocompleteService]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppModule);
                return AppModule;
            }());
            exports_8("AppModule", AppModule);
        }
    }
});

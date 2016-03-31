System.register(['../src/google-places-autocomplete.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var google_places_autocomplete_service_1;
    return {
        setters:[
            function (google_places_autocomplete_service_1_1) {
                google_places_autocomplete_service_1 = google_places_autocomplete_service_1_1;
            }],
        execute: function() {
            describe('First tests', function () {
                it('ts true is true test', function () {
                    return expect(google_places_autocomplete_service_1.GooglePlacesAutocompleteService).toEqual(true);
                });
            });
        }
    }
});

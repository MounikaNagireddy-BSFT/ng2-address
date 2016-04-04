# ng2-address #

This Angular 2 component helps the user to fill in street address. It uses Googles Places API to get suggestions, and shows postalcode or housenumber fields if that info was missing from the returned autocomplete suggestion.

If you choose to use the Google Autocomplete service, make sure you change the Google Maps API key to your own.


## Installation

`npm install ng2-address --save`

From within your typescript project, it's possible to just import from the 'ng2-address' module.


`import {AddressAutocompleteComponent} from 'ng2-address';`

See /example folder.


## Example

The main component of the lib is `AddressAutocompleteComponent`.

```
<address-autocomplete
  [country]="'NL'"
  [placeholderStreet]="'SnappCar Street 6...'"
  [placeholderHouseNumber]="'housenumber...'"
  [placeholderPostalCode]="'postalcode...'"
  (onAddress)="addressChangedHandler">
</address-autocomplete>
```

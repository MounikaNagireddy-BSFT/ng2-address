# ng2-address #

This angular2 component helps the user to fill in a complete address. It uses Googles Places API to get suggestions, and shows postalcode or housenumber fields for incomplete information.

## Dev install ##

Clone this repo. Install node dependencies:
```
npm i
```
Start gulp to build and watch for changes:
```
gulp
```

To start the application, fire up the http server:
```
npm run serve
```
Open url in browser: http://localhost:8080/dist/index.html

Make sure you change the Google Maps API key to your own.

## Planning ##
* Create a nicer distribution of this lib. Make it easier to implement.
* Remove some dependencies
* Perhaps switch to Webpack

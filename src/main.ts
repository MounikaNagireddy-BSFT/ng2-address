/// <reference path="../typings/globals/google.maps/index.d.ts" />
import './polyfills.ts';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
// import { enableProdMode } from '@angular/core';
import {AddressAutoCompleter} from './ng2-address';

// enableProdMode();

platformBrowserDynamic().bootstrapModule(AddressAutoCompleter);

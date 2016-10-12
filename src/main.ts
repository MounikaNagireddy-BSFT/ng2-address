// Entry point for example: $ ng serve
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import './polyfills.ts';
import {Example} from './example.module';

enableProdMode();
platformBrowserDynamic().bootstrapModule(Example);

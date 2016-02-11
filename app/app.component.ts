import {Component} from 'angular2/core';

interface Address {
   street: string;
}

@Component({
    selector: 'my-app',
    template: `
      <address>{{address.address}}</address>
      <input [(ngModel)]="address.street">
      `
})
export class AppComponent {
   public address : Address = {
      street: 'Lucasbolwerk'
   }
   public addresses = ADDRESSES
}


var ADDRESSES : Address[] = [
   {
      street: 'Nobelstraat'
   },
   {
      street: 'Oudegracht'
   },
   {
      street: 'Leuvenplein'
   }
]

import {Component, Input} from '@angular/core';
import {Address} from './address';

@Component({
  selector: 'example',
  templateUrl: 'example.component.html',
  styles: [`
    .autocomplete-container {
          position: absolute;
          width: 100%;
          background-color: #fff;
          padding: 4px;
          z-index: 2;
        }
        .autocomplete-container > div > div {
          padding: 8px 0;
          cursor: pointer;
        }`]})
export class ExampleComponent {
  @Input()
  country: string = 'DE';

  address: Address;

  addressChanged(address: Address) {
    console.log('Addess: ' + address);
  }
}

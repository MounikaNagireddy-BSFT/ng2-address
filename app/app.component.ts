import {Component} from 'angular2/core';
import {AutocompleteComponent} from './autocomplete.component';

interface Address {
  street?: string;
  number?: number;
  toString(): string;
}

@Component({
  selector: 'my-app',
  templateUrl: 'app/templates/app.component.html',
  directives: [AutocompleteComponent]
})
export class AppComponent {
  public address: Address = {
    toString: () => `${this.address.street || ''}, ${this.address.number || ''}`
  };
}

import {Component} from 'angular2/core';
import {AddressAutocompleteComponent} from 'ng2-address';

@Component({
    selector: 'ng2-address-example',
    templateUrl: './app/app.tpl.html',
    directives: [AddressAutocompleteComponent]
})
export class AppComponent {
    private address: any;
    private country: string = 'NL';
}

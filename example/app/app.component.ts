import {Component} from '@angular/core';
import {AddressAutocompleteComponent} from 'ng2-address';

@Component({
    selector: 'ng2-address-example',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    private address: any;
    private country: string = 'NL';

    constructor(private addressAutocompleteComponent: AddressAutocompleteComponent){        
    }
}

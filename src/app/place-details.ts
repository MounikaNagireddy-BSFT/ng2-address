import { Address } from './address';

export class PlaceDetails {
  id: string;
  address: Address

  constructor(id?: string){
    this.id = id;
    this.address = new Address();
  }
}

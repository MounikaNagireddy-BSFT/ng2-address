export class Address {
  street:       string;
  houseNumber:  string;
  postalCode:   string;
  city:         string;
  country:      string;

  coords: {
    lat: number,
    lng: number
  }

  toString() : string {
    // Get all *filled* fields from this object and concatenate them.
    return ['street', 'houseNumber', 'city', 'country']
      .map(k => this[k])  // Get all values for given keys
      .filter(v => !!v)   // Check if the value is truthy (not null/undefined/empty string)
      .join(' ');
  }

  isComplete(): boolean {
    return ['street', 'houseNumber', 'city', 'postalCode', 'country']
      .every(k => !!this[k]);
  }
}

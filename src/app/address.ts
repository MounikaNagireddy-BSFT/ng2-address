export class Address {
  street:       string;
  houseNumber:  string;
  postalCode:   string;
  city:         string;
  country:      string;

  toString() : string {
    // Get all *filled* fields from this object and concatenate them.
    return Object.keys(this)
      .map(k => this[k])  // Get all values using the keys
      .filter(v => !!v)   // Check if the value is truthy (not null/undefined/empty string)
      .join(' ');
  }
}

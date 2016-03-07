
export class PlaceSuggestion {
  description: string;
  place_id: string;
  prediction: google.maps.places.AutocompletePrediction;
  houseNumber: string;

  constructor(googleResult) {
    this.description = googleResult.description;
    this.place_id = googleResult.place_id;
    this.prediction = googleResult;
  }

  toString(): string {
    if(this.houseNumber){
      let addrCmp = this.description.split(', ');

      addrCmp.splice(1, 0, this.houseNumber);
      let newDescription = addrCmp.join(' ');

      return newDescription;
    } else{
      return this.description
    }
  }
}

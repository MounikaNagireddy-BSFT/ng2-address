
export class PlaceSuggestion {
  description: string;
  place_id: string;
  prediction: google.maps.places.AutocompletePrediction;

  constructor(googleResult) {
    this.description = googleResult.description;
    this.place_id = googleResult.place_id;
    this.prediction = googleResult;
  }

  toString(): string {
    return this.description;
  }
}

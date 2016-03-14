
export class PlaceSuggestion {
  id: string;
  description: string;
  type: PlaceType;

  toString(): string {
    return this.description;
  }
}

export enum PlaceType {
  StreetAddress,
  Route
}

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}

export interface IBeach {
 name: string;
 position: BeachPosition;
 lat: number;
 lng: number;
 user: string;
}
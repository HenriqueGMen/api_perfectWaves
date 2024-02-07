export interface IStormglassPointSoucer {
  [key: string]: number;
}

export interface IStormglassPoint {
  readonly time: string;
  readonly swellDirection: IStormglassPointSoucer;
  readonly swellHeight: IStormglassPointSoucer;
  readonly swellPeriod: IStormglassPointSoucer;
  readonly waveDirection: IStormglassPointSoucer;
  readonly waveHeight: IStormglassPointSoucer;
  readonly windDirection: IStormglassPointSoucer;
  readonly windSpeed: IStormglassPointSoucer;
}

export interface IStormglassForecastResponse {
  hours: IStormglassPoint[];
}

export interface IForecastPoint {
  readonly time: string;
  readonly swellDirection: number;
  readonly swellHeight: number;
  readonly swellPeriod: number;
  readonly waveDirection: number;
  readonly waveHeight: number;
  readonly windDirection: number;
  readonly windSpeed: number;
}

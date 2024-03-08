import { IBeachForecast } from "@src/services/repositories/IBeachForecast";

export interface ITimeForecast {
  time: string;
  forecast: IBeachForecast[]
}
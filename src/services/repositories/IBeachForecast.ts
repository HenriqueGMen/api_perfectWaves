import { IForecastPoint } from "@src/clients/stormglass/repositories/IStormglass";
import { IBeach } from "./IBeach";

export interface IBeachForecast extends Omit<IBeach, 'user'>, IForecastPoint {
  
}
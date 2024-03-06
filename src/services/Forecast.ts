import { StormGlass } from "@src/clients/StormGlass";
import { IBeach } from "@src/services/repositories/IBeach";
import { IBeachForecast } from "./repositories/IBeachForecast";

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(beaches: IBeach[]): Promise<IBeachForecast[]> {
    const pointWithCorrectSources: IBeachForecast[] = [];

    for(const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      const attBeachData = points.map((e) => ({
        ...{
          lat:beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1
        },
        ...e
      }));

      pointWithCorrectSources.push(...attBeachData);
    }
    return pointWithCorrectSources
  }
}
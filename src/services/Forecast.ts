import { StormGlass } from "@src/clients/StormGlass";
import { IForecastPoint } from "@src/clients/stormglass/repositories/IStormglass";
import { IBeach } from "@src/services/repositories/IBeach";
import { IBeachForecast } from "@src/services/repositories/IBeachForecast";
import { ITimeForecast } from "@src/services/repositories/ITimeForecast";
import { ForecastProcessingInternalError } from "@src/util/errors/ForecastProcessingInternalError.1";

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(beaches: IBeach[]): Promise<ITimeForecast[]> {
    const pointWithCorrectSources: IBeachForecast[] = [];

    try {
      for(const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const attBeachData = this.attBeachData(points, beach);
  
        pointWithCorrectSources.push(...attBeachData);
      }
      return this.mapForecastByTime(pointWithCorrectSources);
    } catch(error) {
      throw new ForecastProcessingInternalError((error as Error).message);
    }
  }

  private attBeachData(points: IForecastPoint[], beach: IBeach): IBeachForecast[] {
    return points.map((e) => ({...{
        lat:beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1
      },
      ...e
    }));
  }

  private mapForecastByTime(forecast: IBeachForecast[]): ITimeForecast[] {
    const forecastByTime: ITimeForecast[] = [];

    for(const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);

      if(timePoint) {
        timePoint.forecast.push(point)
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }
    return forecastByTime;
  }
}
import { StormGlass } from "@src/clients/StormGlass";
import { IBeach } from "@src/services/repositories/IBeach";
import { IBeachForecast } from "@src/services/repositories/IBeachForecast";
import { ITimeForecast } from "@src/services/repositories/ITimeForecast";


export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(beaches: IBeach[]): Promise<ITimeForecast[]> {
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
    return this.mapForecastByTime(pointWithCorrectSources);
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
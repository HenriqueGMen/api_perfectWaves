import { AxiosStatic } from 'axios';
import {
  IForecastPoint,
  IStormglassForecastResponse,
  IStormglassPoint,
} from '@src/clients/stormglass/repositories/IStormglass';

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassSourcer = 'noaa';

  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, log: number): Promise<IForecastPoint[]> {
    const response = await this.request.get<IStormglassForecastResponse>(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${log}&params=${this.stormGlassAPIParams}&source=${this.stormGlassSourcer}`
    );
    return this.normalizeResponse(response.data);
  }

  private normalizeResponse(
    points: IStormglassForecastResponse
  ): IForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.stormGlassSourcer],
      swellHeight: point.swellHeight[this.stormGlassSourcer],
      swellPeriod: point.swellPeriod[this.stormGlassSourcer],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassSourcer],
      waveHeight: point.waveHeight[this.stormGlassSourcer],
      windDirection: point.windDirection[this.stormGlassSourcer],
      windSpeed: point.windSpeed[this.stormGlassSourcer],
    }));
  }

  private isValidPoint(point: Partial<IStormglassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassSourcer] &&
      point.swellHeight?.[this.stormGlassSourcer] &&
      point.swellPeriod?.[this.stormGlassSourcer] &&
      point.waveDirection?.[this.stormGlassSourcer] &&
      point.waveHeight?.[this.stormGlassSourcer] &&
      point.windDirection?.[this.stormGlassSourcer] &&
      point.windSpeed?.[this.stormGlassSourcer]
    );
  }
}

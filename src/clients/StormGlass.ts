import { AxiosStatic } from 'axios';

export class StormGlass {
  readonly stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassSourcer = 'noaa';

  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, log: number): Promise<object> {
    return this.request.get(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${log}&params=${this.stormGlassAPIParams}&source=${this.stormGlassSourcer}`
    );
  }
}

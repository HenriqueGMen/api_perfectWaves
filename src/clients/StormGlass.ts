import { AxiosError } from 'axios';
import { ClientRequestError, StormGlassResponseError } from '@src/clients/ClientError';
import config, { IConfig } from 'config';
import {
  IForecastPoint,
  IStormglassForecastResponse,
  IStormglassPoint,
} from '@src/clients/stormglass/repositories/IStormglass';
import * as HTTPUtil from '@src/util/request';

const stormglassResourceConfig: IConfig = config.get(
  'App.resources.StormGlass'
);

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassSourcer = 'noaa';

  constructor(protected request = new HTTPUtil.Request()) {}

  public async fetchPoints(
    lat: number,
    log: number
  ): Promise<IForecastPoint[]> {
    try {
      const response = await this.request.get<IStormglassForecastResponse>(
        `${stormglassResourceConfig.get(
          'apiUrl'
        )}/weather/point?lat=${lat}&lng=${log}&params=${this.stormGlassAPIParams}&source=${this.stormGlassSourcer}`,
        {
          headers: {
            Authorization: stormglassResourceConfig.get('apiToken'),
          },
        }
      );
      return this.normalizeResponse(response.data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const axiosError = err;
    
        if (HTTPUtil.Request.isRequestError(axiosError) && axiosError.response && axiosError.response.status) {
          throw new StormGlassResponseError(
            `Error: ${JSON.stringify(axiosError.response.data)} Code: ${axiosError.response.status}`
          );
        }
    
        throw new ClientRequestError((err as { message: string }).message);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new ClientRequestError((err as { message: any }).message);
    }
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

import { StormGlass } from '@src/clients/StormGlass';
import stormglassWeatherFixture from '@test/fixtures/stormglass_weather.json';
import stormglassNormalizedFixture from '@test/fixtures/stormglass_normalized.json';
import * as HTTPUtil from '@src/util/request';

jest.mock('@src/util/request');

describe('Stromglass client', () => {
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it('should return the normalized forecast from the stormglass service', async () => {
    const lat = -8.52549;
    const log = -35.007;

    mockedRequest.get.mockResolvedValue({ data: stormglassWeatherFixture } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const res = await stormGlass.fetchPoints(lat, log);

    expect(res).toEqual(stormglassNormalizedFixture);
  });

  it('should exclude incomplete data points', async () => {
    const lat = -33.792726;
    const lng = 151.289824;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };

    mockedRequest.get.mockResolvedValue({ data: incompleteResponse } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    class FakeAxiosError extends Error {
      constructor(public response: object) {
        super();
      }
    }

    jest.spyOn(HTTPUtil.Request, 'isRequestError').mockReturnValue(true);

    mockedRequest.get.mockRejectedValue(
      new FakeAxiosError({
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      })
    );

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass'
    );
  });

});

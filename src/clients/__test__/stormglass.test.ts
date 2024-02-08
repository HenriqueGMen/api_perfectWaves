import { StormGlass } from '@src/clients/StormGlass';
import axios from 'axios';
import stormglassWeatherFixture from '@test/fixtures/stormglass_weather.json';
import stormglassNormalizedFixture from '@test/fixtures/stormglass_normalized.json';

jest.mock('axios');

describe('Stromglass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it('should return the normalized forecast from the stormglass service', async () => {
    const lat = -8.52549;
    const log = -35.007;

    mockedAxios.get.mockResolvedValue({ data: stormglassWeatherFixture });

    const stormGlass = new StormGlass(mockedAxios);
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

    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });
});

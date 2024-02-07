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

    mockedAxios.get.mockResolvedValue({data: stormglassWeatherFixture});

    const stormGlass = new StormGlass(mockedAxios);
    const res = await stormGlass.fetchPoints(lat, log);

    expect(res).toEqual(stormglassNormalizedFixture);
  });
});

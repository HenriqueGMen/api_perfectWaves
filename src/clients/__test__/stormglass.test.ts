import { StormGlass } from '@src/clients/StormGlass';
import axios from 'axios';
import stormglassWeatherFixture from '@test/fixtures/stormglass_weather.json';
import stormglassNormalizedFixture from '@test/fixtures/stormglass_normalized.json';

jest.mock('axios');

describe('Stromglass client', () => {
  it('should return the normalized forecast from the stormglass service', async () => {
    const lat = -8.52549;
    const log = -35.007;

    axios.get = jest.fn().mockResolvedValue({data: stormglassWeatherFixture});

    const stormGlass = new StormGlass(axios);
    const res = await stormGlass.fetchPoints(lat, log);

    expect(res).toEqual(stormglassNormalizedFixture);
  });
});

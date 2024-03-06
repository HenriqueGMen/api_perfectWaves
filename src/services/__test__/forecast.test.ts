import { StormGlass } from '@src/clients/StormGlass';
import stormGlassNomalized from '@test/fixtures/stormglass_normalized.json'

jest.mock('@src/clients/StormGlass');

describe('Forecast Service', () => {
  it('should be able to return the forecast for a list of beaches', async () => {
    StormGlass.prototype.fetchPoints = jest.fn().mockResolvedValue(stormGlassNomalized);

    const beaches = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        user: 'some-id',
      },
    ]

    const expectedResponse = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        rating: 1,
        swellDirection: 64.26,
        swellHeight: 0.15,
        swellPeriod: 3.89,
        time: '2020-04-26T00:00:00+00:00',
        waveDirection: 231.38,
        waveHeight: 0.47,
        windDirection: 299.45,
        windSpeed: 100,
      },
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        rating: 1,
        swellDirection: 123.41,
        swellHeight: 0.21,
        swellPeriod: 3.67,
        time: '2020-04-26T01:00:00+00:00',
        waveDirection: 232.12,
        waveHeight: 0.46,
        windDirection: 310.48,
        windSpeed: 100,
      },
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        rating: 1,
        swellDirection: 182.56,
        swellHeight: 0.28,
        swellPeriod: 3.44,
        time: '2020-04-26T02:00:00+00:00',
        waveDirection: 232.86,
        waveHeight: 0.46,
        windDirection: 321.5,
        windSpeed: 100,
      },
    ]

    const forecast = new Forecast(new StormGlass());
    const beachesRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesRating).toEqual(expectedResponse)

  });
});
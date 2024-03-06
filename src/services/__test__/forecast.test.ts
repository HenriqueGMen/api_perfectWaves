import { StormGlass } from '@src/clients/StormGlass';
import stormGlassNomalized from '@test/fixtures/stormglass_normalized.json'
import { BeachPosition, IBeach } from '@src/services/repositories/IBeach';
import { Forecast } from '@src/services/Forecast';

jest.mock('@src/clients/StormGlass');

describe('Forecast Service', () => {
  it('should be able to return the forecast for a list of beaches', async () => {
    StormGlass.prototype.fetchPoints = jest.fn().mockResolvedValue(stormGlassNomalized);

    const beaches: IBeach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
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
        swellDirection: 58.22,
        swellHeight: 0.17,
        swellPeriod: 14.53,
        time: "2024-02-15T22:00:00+00:00",
        waveDirection: 143.45,
        waveHeight: 0.94,
        windDirection: 105.57,
        windSpeed: 2.74
      },
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        rating: 1,
        swellDirection: 56.41,
        swellHeight: 0.19,
        swellPeriod: 14.49,
        time: "2024-02-15T23:00:00+00:00",
        waveDirection: 143.25,
        waveHeight: 0.94,
        windDirection: 102.14,
        windSpeed: 2.71
      },
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        rating: 1,
        swellDirection: 54.61,
        swellHeight: 0.2,
        swellPeriod: 14.44,
        time: "2024-02-16T00:00:00+00:00",
        waveDirection: 143.06,
        waveHeight: 0.94,
        windDirection: 98.7,
        windSpeed: 2.67
      },
    ]

    const forecast = new Forecast(new StormGlass());
    const beachesRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesRating).toEqual(expectedResponse)

  });
});
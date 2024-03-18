import { Beach } from "@src/model/beach";

describe('Beaches functional tests', () => {
  beforeAll(async () => await Beach.deleteMany());

  describe('When a beach is creating', () => {
    it('should be able to create a beach', async () => {
      const beach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(beach);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(beach));
    });

    it('should return 422 when there is a validation error', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };
      const response = await global.testRequest.post('/beaches').send(newBeach);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid_string" (type string) at path "lat"',
      });
    });

    it('should return 500 when there is any error other than validation error', async () => {
      jest.spyOn(Beach.prototype, 'save').mockImplementationOnce(() => {
        throw new Error('Some unexpected error occurred');
      });
    
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };
    
      const response = await global.testRequest.post('/beaches').send(newBeach);
    
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });

  });
})
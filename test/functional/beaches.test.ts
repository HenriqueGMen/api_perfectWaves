describe('Beaches functional tests', () => {
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

  })
})
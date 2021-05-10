import request from 'supertest';
import { app } from '../../../main';


describe('Account Controller', () => {
  const testUser = {
    email: 'tspensb@gov.uk',
    password: 'bsAfDXtzPr',
  };
  it('Login: succeeds with correct credentials', async () => {
    const response = await post('/v1/login', testUser);
  });
});

// a helper function to make a POST request.
export function post(url, body) {
  const httpRequest = request(app).post(url);
  httpRequest.send(body);
  httpRequest.set('Accept', 'application/json');
  // httpRequest.set('Origin', 'http://localhost:8000')
  return httpRequest;
}

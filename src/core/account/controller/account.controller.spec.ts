import { strict as assert } from 'assert';
import request from 'supertest';
import { app as $app } from '../../../main';
import { APIFactory } from '../../factory/api/factory.api';

const app = APIFactory.configure($app);

describe('Account Controller', () => {
  const testUser = {
    email: 'tspensb@gov.uk',
    password: 'bsAfDXtzPr',
  };
  it('Login: should succeeds with correct credentials', (done) => {
    const response = post('/v1/login', testUser);
    response
      .expect(200)
      .then((res) => {
        expect.objectContaining({
          data: {
            email: testUser.email,
            _id: expect.any(String),
            user: expect.objectContaining({
              email: testUser.email,
              first_name: expect.any(String),
              last_name: expect.any(String),
              account: expect.any(String),
              mobile: expect.any(String),
              _id: expect.any(String),
              role: expect.any(String),
            }),
          },
          meta: { code: 200, token: expect.any(String) },
        });
        done();
      })
      .catch((err) => done(err));
  });
});

// a helper function to make a POST request.
export function post(url, body) {
  const httpRequest = request(app).post(url);
  httpRequest.send(body);
  httpRequest.set('Accept', 'application/json');
  // httpRequest.expect('Content-Type', /json/);
  httpRequest.set('x-api-key', 'FiBoNaCciKeY');
  return httpRequest;
}

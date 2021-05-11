import { strict as assert } from 'assert';
import Mongoose from 'mongoose';
import request from 'supertest';
import { app as $app } from '../../../main';
import { APIFactory } from '../../factory/api/factory.api';

const app = APIFactory.configure($app);

describe('Account Controller: Login', () => {
  it('should succeeds with correct credentials', (done) => {
    const testUser = {
      email: 'tspensb@gov.uk',
      password: 'bsAfDXtzPr',
    };
    const req = post('/v1/login', testUser);
    req
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({
          data: {
            email: testUser.email,
            _id: expect.any(String),
            mobile: expect.any(String),
            last_seen_at: expect.any(String),
            is_verified: expect.any(Boolean),
            user: {
              email: testUser.email,
              first_name: expect.any(String),
              last_name: expect.any(String),
              account: expect.any(String),
              mobile: expect.any(String),
              _id: expect.any(String),
              role: expect.any(String),
            },
          },
          meta: { code: 200, token: expect.any(String) },
        });

        done();
      })
      .catch((err) => done(err));
  });

  it('Should return 401 invalid credentials', (done) => {
    const testUser = {
      email: 'tspensb@gov.uk',
      password: 'passwordtspen',
    };
    const req = post('/v1/login', testUser);
    req
      .expect(401)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            code: 401,
            message: expect.any(String),
            http_response: expect.objectContaining({
              status: expect.any(Number),
              message: expect.any(String),
            }),
          }),
        );
        done();
      })
      .catch((err) => done(err));
  });

  it('Should return 400, citing an short password length and email format', (done) => {
    const testUser = {
      email: 'tspensb@go',
      password: 'pass',
    };
    const req = post('/v1/login', testUser);
    req
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          code: 400,
          message: expect.stringContaining(
            JSON.stringify(['The email format is invalid.', 'The password must be at least 6 characters.']),
          ),
          details: {
            password: ['The password must be at least 6 characters.'],
            email: ['The email format is invalid.'],
          },
          http_response: {
            status: expect.any(Number),
            message: expect.any(String),
          },
        });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('Account Controller: Register', () => {
  const generateRandomEmail = () => {
    const randString = Array.from({ length: 20 }, () => Math.floor(Math.random() * (65 + 25 - 65) + 65))
      .reduce((a: string, b: number) => a + String.fromCharCode(b), '')
      .toLowerCase();
    return randString + '@tester.io';
  };
  it('should succeeds with correct credentials: 201', (done) => {
    const testUser = {
      first_name: 'Mark',
      last_name: 'Spencer',
      email: generateRandomEmail(),
      gender: 'male',
      password: 'bsAfDXtzPr',
      mobile: '+2349058756921',
    };
    const req = post('/v1/register', testUser);
    req
      .expect(201)
      .then((res) => {
        expect(res.body).toMatchObject({
          data: {
            email: testUser.email,
            _id: expect.any(String),
            mobile: expect.any(String),
            last_seen_at: expect.any(String),
            is_verified: expect.any(Boolean),
            user: {
              email: testUser.email,
              first_name: expect.any(String),
              last_name: expect.any(String),
              account: expect.any(String),
              mobile: expect.any(String),
              _id: expect.any(String),
              role: expect.any(String),
            },
          },
          meta: { code: 201, token: expect.any(String), message: expect.any(String) },
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('should return 400, citing an invalid syntax error', (done) => {
    const testUser = {};
    const req = post('/v1/register', testUser);
    const detailResponse = {
      email: ['The email field is required.'],
      first_name: ['The first name field is required.'],
      last_name: ['The last name field is required.'],
      gender: ['The gender field is required.'],
      password: ['The password field is required.'],
      mobile: ['The mobile field is required.'],
    };
    req
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          code: 400,
          message: expect.stringContaining(JSON.stringify(Object.values(detailResponse).flat(2))),
          details: detailResponse,
          http_response: {
            status: expect.any(Number),
            message: expect.any(String),
          },
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('should return 409 since account already exist', (done) => {
    const testUser = {
      first_name: 'Tudor',
      last_name: 'Spens',
      email: 'tspensb@gov.uk',
      gender: 'male',
      password: 'bsAfDXtzPr',
      mobile: '+2349058756921',
    };
    const req = post('/v1/register', testUser);
    req
      .expect(409)
      .then((res) => {
        expect(res.body).toEqual({
          code: 409,
          message: 'Account already exists. Please log in!',
          http_response: {
            status: 409,
            message: 'The request could not be completed due to a conflict with the current state of the resource.',
          },
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
  httpRequest.expect('Content-Type', /json/);
  httpRequest.set('x-api-key', process.env.API_KEY);
  return httpRequest;
}

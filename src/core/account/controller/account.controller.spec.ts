import request from 'supertest';
import { app as $app } from '../../../main';
import { HttpResponse } from '../../../enums/http-response.enum';
import { APIFactory } from '../../factory/api/factory.api';
import locale from '../../../locale';
import { getSync } from '../../../locale/index';
import { AccountModel } from '../schema/account.schema';
import { FnHelpers } from '../../../utils/helpers/fn.helpers';
import { add } from 'date-fns';
import { UserModel } from '../../users/schema/users.schema';
import { TestFactory } from '../../factory/testing/factory.testing';

const app = APIFactory.configure($app);

describe('Account Controller: Login', () => {
  it('should succeeds with correct credentials', (done) => {
    const testUser = {
      email: 'tspensb@gov.uk',
      password: 'bsAfDXtzPr',
    };
    const req = TestFactory.post(app, '/v1/login', testUser);
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
          meta: { code: 200, token: expect.any(String), http_response: HttpResponse.OK },
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
    const appLocale = locale.getSync('en');
    const req = TestFactory.post(app, '/v1/login', testUser);
    req
      .expect(401)
      .then((res) => {
        expect(res.body).toEqual({
          code: 401,
          message: appLocale.auth.authentication_failed,
          http_response: HttpResponse.UNAUTHORIZED,
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('Should return 404 account does not exist', (done) => {
    const testUser = {
      email: 'tspensb@gov.lol',
      password: 'passwordtspen',
    };
    const appLocale = locale.getSync('en');
    const req = TestFactory.post(app, '/v1/login', testUser);
    req
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({
          code: 404,
          message: appLocale.auth.account_does_not_exist,
          http_response: HttpResponse.NOT_FOUND,
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('Should return 400, citing an short password length and email format', (done) => {
    const testUser = {
      email: 'tspensb@go',
      password: 'pass',
    };
    const req = TestFactory.post(app, '/v1/login', testUser);
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
          http_response: HttpResponse.BAD_REQUEST,
        });
        done();
      })
      .catch((err) => done(err));
  });
});

describe('Account Controller: Registration', () => {
  const generateRandomEmail = () => {
    const randString = Array.from({ length: 20 }, () => Math.floor(Math.random() * (65 + 25 - 65) + 65))
      .reduce((a: string, b: number) => a + String.fromCharCode(b), '')
      .toLowerCase();
    return randString + '@tester.io';
  };
  const email = generateRandomEmail();
  it('should succeeds with correct credentials: 201', (done) => {
    const testUser = {
      first_name: 'Mark',
      last_name: 'Spencer',
      email,
      gender: 'male',
      password: 'bsAfDXtzPr',
      mobile: '+2349058756921',
    };
    const appLocale = locale.getSync('en');
    const req = TestFactory.post(app, '/v1/register', testUser);
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
          meta: {
            code: 201,
            token: expect.any(String),
            message: appLocale.account.created,
            http_response: HttpResponse.CREATED,
          },
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('should return 400, citing an invalid syntax error', (done) => {
    const testUser = {};
    const req = TestFactory.post(app, '/v1/register', testUser);
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
          http_response: HttpResponse.BAD_REQUEST,
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
    const appLocale = locale.getSync('en');
    const req = TestFactory.post(app, '/v1/register', testUser);
    req
      .expect(409)
      .then((res) => {
        expect(res.body).toEqual({
          code: 409,
          message: appLocale.auth.duplicate_error,
          http_response: HttpResponse.CONFLICT,
        });
        done();
      })
      .catch((err) => done(err));
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: /@tester/i });
    await AccountModel.deleteMany({ email: /@tester/i });
  });
});

describe('Account Controller: Verification', () => {
  it("should return 401 unauthorized since there's no authorization token", (done) => {
    const appLocale = locale.getSync('en');
    const req = TestFactory.post(app, '/v1/verify-account', { verification_code: '450011' });
    req
      .expect(401)
      .then((res) => {
        expect(res.body).toEqual({
          code: 401,
          message: appLocale.auth.no_authorization_token,
          http_response: HttpResponse.UNAUTHORIZED,
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('should return 200 and verify user', (done) => {
    const req = TestFactory.post(app, '/v1/verify-account', { verification_code: '645479' });
    // If test fails updated token
    req.set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2MDliMDdkNmI1MDM5ZjFlYTk2NzhhYWMiLCJlbWFpbCI6InRqb2huc0Bnb3YudWsiLCJpYXQiOjE2MjA4MTk1NzEsImV4cCI6MTY2NTQ1OTU3MX0.JX5hNuAS2b-G6qTrqh6dCjbMjYQbZrIJEciaz6dB3d8',
    );

    const appLocale = locale.getSync('en');
    const testUser = { email: 'tjohns@gov.uk' };

    req
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({
          data: {
            email: testUser.email,
            _id: expect.any(String),
            mobile: expect.any(String),
            last_seen_at: expect.any(String),
            is_verified: true,
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
          meta: {
            code: 200,
            message: appLocale.auth.verification_successful,
            http_response: HttpResponse.OK,
          },
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('should return 409 account has already been verified', (done) => {
    const appLocale = locale.getSync('en');
    const req = TestFactory.post(app, '/v1/verify-account', { verification_code: '450011' });
    req.set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2MDliMDdkNmI1MDM5ZjFlYTk2NzhhYWMiLCJlbWFpbCI6InRqb2huc0Bnb3YudWsiLCJpYXQiOjE2MjA4MTk1NzEsImV4cCI6MTY2NTQ1OTU3MX0.JX5hNuAS2b-G6qTrqh6dCjbMjYQbZrIJEciaz6dB3d8',
    );
    // Email = tjohns@gov.uk
    req
      .expect(409)
      .then((res) => {
        expect(res.body).toEqual({
          code: 409,
          message: appLocale.auth.account_verified,
          http_response: HttpResponse.CONFLICT,
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('should return 400: Invalid verification code length', (done) => {
    const appLocale = locale.getSync('en');
    const req = TestFactory.post(app, '/v1/verify-account', { verification_code: '4501' });
    req.set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2MDliMDdkNmI1MDM5ZjFlYTk2NzhhYWMiLCJlbWFpbCI6InRqb2huc0Bnb3YudWsiLCJpYXQiOjE2MjA4MTk1NzEsImV4cCI6MTY2NTQ1OTU3MX0.JX5hNuAS2b-G6qTrqh6dCjbMjYQbZrIJEciaz6dB3d8',
    );
    req
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          code: 400,
          message: JSON.stringify(['The verification code must be at least 6 characters.']),
          details: {
            verification_code: ['The verification code must be at least 6 characters.'],
          },
          http_response: HttpResponse.BAD_REQUEST,
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('should return 429: Too many retries of verification code', (done) => {
    const appLocale = locale.getSync('en');
    const req = TestFactory.post(app, '/v1/verify-account', { verification_code: '609714' });
    // Emails = markspencer@go.io
    req.set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2MDliMGEwNGJiYjBmMzM0NmYxYmJlMDQiLCJlbWFpbCI6Im1hcmtzcGVuY2VyQGdvLmlvIiwiaWF0IjoxNjIwODIyMTUyLCJleHAiOjE2NjU0NjIxNTJ9.cWfiUVfaH4nvtNPGVVqCc11Nb4CjRXGSw8rnHBh1O_s',
    );
    req
      .expect(429)
      .then((res) => {
        expect(res.body).toEqual({
          code: 429,
          message: appLocale.auth.verification_code_retry_reached,
          http_response: HttpResponse.TOO_MANY_REQUESTS,
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('should return 410: Verification code expired', (done) => {
    const appLocale = locale.getSync('en');
    const req = TestFactory.post(app, '/v1/verify-account', { verification_code: '183098' });
    // Emails = tspensb7@gov.io
    req.set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2MDliYjI1ZmJlNDdmNzNmODQxZmNiMTkiLCJlbWFpbCI6InRzcGVuc2I3QGdvdi5pbyIsImlhdCI6MTYyMDgyNDI1NSwiZXhwIjoxNjY1NDY0MjU1fQ.cyuJE3nFIfIjk9NjKi0OBw48701wQmROYA_m8wIirDg',
    );
    req
      .expect(410)
      .then((res) => {
        expect(res.body).toEqual({
          code: 410,
          message: appLocale.auth.verification_code_expired,
          http_response: HttpResponse.GONE,
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('should return 422: Invalid verification code', (done) => {
    const appLocale = locale.getSync('en');
    const req = TestFactory.post(app, '/v1/verify-account', { verification_code: '18o098' });
    // Emails = tspensb7@gov.uk
    req.set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2MDliYWM2YTQ1ZWMwYzIxYTAxNGNjYTkiLCJlbWFpbCI6InRzcGVuc2I3QGdvdi51ayIsImlhdCI6MTYyMDgyNTMwNywiZXhwIjoxNjY1NDY1MzA3fQ.vabNGGllxjdrPBcnUfARoWo58j_oncD_gMEwXuwEuPA',
    );
    req
      .expect(422)
      .then((res) => {
        expect(res.body).toEqual({
          code: 422,
          message: appLocale.auth.invalid_verification_code,
          http_response: HttpResponse.UNPROCESSABLE_ENTITY,
        });
        done();
      })
      .catch((err) => done(err));
  });

  afterAll(async () => {
    await AccountModel.findByIdAndUpdate(
      '609b07d6b5039f1ea9678aac',
      {
        $set: {
          verification_code: '645479',
          verification_code_retry_count: 0,
          is_verified: false,
          verification_code_expiration: add(new Date(), { months: 20 }),
        },
      },
      { new: true },
    );
  });
});

describe('Account Controller: Verification', () => {
  it('should return 200: Verification code sent', (done) => {
    const appLocale = locale.getSync('en');
    const req = TestFactory.put(app, '/v1/resend-verification-code', {});
    // Emails = tspensb7@gov.uk
    req.set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2MDliYWM2YTQ1ZWMwYzIxYTAxNGNjYTkiLCJlbWFpbCI6InRzcGVuc2I3QGdvdi51ayIsImlhdCI6MTYyMDgyNTMwNywiZXhwIjoxNjY1NDY1MzA3fQ.vabNGGllxjdrPBcnUfARoWo58j_oncD_gMEwXuwEuPA',
    );
    req
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          code: 200,
          message: appLocale.auth.verification_code_resend,
          http_response: HttpResponse.OK,
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('should return 409: when account has already been verified', (done) => {
    const appLocale = locale.getSync('en');
    const req = TestFactory.put(app, '/v1/resend-verification-code', {});
    // Emails = tjohns@gov.uk
    req.set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2MDliMDdkNmI1MDM5ZjFlYTk2NzhhYWMiLCJlbWFpbCI6InRqb2huc0Bnb3YudWsiLCJpYXQiOjE2MjA4MTk1NzEsImV4cCI6MTY2NTQ1OTU3MX0.JX5hNuAS2b-G6qTrqh6dCjbMjYQbZrIJEciaz6dB3d8',
    );
    req
      .expect(409)
      .then((res) => {
        expect(res.body).toEqual({
          code: 409,
          message: appLocale.auth.account_verified,
          http_response: HttpResponse.CONFLICT,
        });
        done();
      })
      .catch((err) => done(err));
  });
});

import { Express } from 'express';
import request from 'supertest';

export class TestFactory {
  static post(app: Express, url: string, body: Record<string, any>) {
    const httpRequest = request(app).post(url);
    httpRequest.send(body);
    httpRequest.set('Accept', 'application/json');
    httpRequest.expect('Content-Type', /json/);
    httpRequest.set('x-api-key', process.env.API_KEY);
    return httpRequest;
  }

  static put(app: Express, url: string, body: Record<string, any>) {
    const httpRequest = request(app).put(url);
    httpRequest.send(body);
    httpRequest.set('Accept', 'application/json');
    httpRequest.expect('Content-Type', /json/);
    httpRequest.set('x-api-key', process.env.API_KEY);
    return httpRequest;
  }

  static delete(app: Express, url: string) {
    const httpRequest = request(app).delete(url);
    httpRequest.set('Accept', 'application/json');
    httpRequest.expect('Content-Type', /json/);
    httpRequest.set('x-api-key', process.env.API_KEY);
    return httpRequest;
  }

  static get(app: Express, url: string) {
    const httpRequest = request(app).delete(url);
    httpRequest.set('Accept', 'application/json');
    httpRequest.expect('Content-Type', /json/);
    httpRequest.set('x-api-key', process.env.API_KEY);
    return httpRequest;
  }
}

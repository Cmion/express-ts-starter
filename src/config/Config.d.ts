export interface IConfig {
  port: number;
  api: Api;
  app: App;
  database: Database;
  mail: Mail;
  sms: Sms;
  worker: Worker;
}
interface Worker {
  rabbitmq: Rabbitmq;
}
interface Rabbitmq {
  uri: string;
}
interface Sms {
  twilio: Twilio;
}
interface Twilio {
  sid: string;
  token: string;
  phone_number: string;
}
interface Mail {
  mail_trap: Mailtrap;
  send_grid: Sendgrid;
  mail_sender: undefined;
}
interface Sendgrid {
  port: number;
}
interface Mailtrap {
  port: number;
  user: string;
  host: string;
  pass: string;
}
interface Database {
  uri: string;
  test_uri: string;
}
interface App {
  app_name: string;
  environment: string;
  base_url: string;
  port: number;
  secrets: Secrets;
}
interface Secrets {
  server_secret: string;
}
interface Api {
  default_locale: string;
  prefix: string;
  version: number;
  pagination: Pagination;
  expires_in: number;
  verification_code_expiration: number;
  verification_retry_max: number;
  user_roles: string[];
}
interface Pagination {
  items_per_page: number;
}

export class Account {
  email: string;
  mobile: string;
  password: string;
  last_seen_at: Date;
  is_verified: boolean;
  deleted: boolean;
  verification_code: string;
  verification_code_expiration: Date;
  verification_code_retry_count: number;
  password_log: { password: string; log_date: Date }[];
  reset_password_code: string | null;
  reset_password_code_expiration: Date | null;
  reset_password_code_retry_count: number;
}

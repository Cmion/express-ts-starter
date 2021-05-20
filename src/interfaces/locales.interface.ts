export interface AppLocale {
  auth: {
    incorrect_credentials: string;
    authentication_failed: string;
    invalid_user_access: string;
    expired_token: string;
    authorization_error: string;
    no_authorization_token: string;
    duplicate_error: string;
    account_not_found: string;
    credential_incorrect: string;
    account_suspended: string;
    account_archived: string;
    password_reset_unauthorized: string;
    password_reset_code_expired: string;
    verification_successful: string;
    verification_unauthorized: string;
    account_does_not_exist: string;
    invalid_verification_code: string;
    verification_code_expired: string;
    account_verified: string;
    account_not_verified: string;
    mobile_verified: string;
    incorrect_password: string;
    email_does_not_exist: string;
    verification_mobile_sent: string;
    social_account_error: string;
    verification_code_retry_reached: string;
    verification_code_resend: string;
    change_password: {
      is_previous_password: string;
      is_current_password: string;
      incorrect_password: string;
      success: string;
    };
  };
  error: {
    server: string;
    resourceNotFound: string;
  };
  users: {
    created: string;
    updated: string;
    deleted: string;
    notFound: string;
  };
  account: {
    created: string;
    updated: string;
    deleted: string;
    notFound: string;
  };
}

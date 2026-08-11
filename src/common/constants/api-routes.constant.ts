export const API_ROUTES = {
  AUTH: {
    ROOT: 'auth',
    SIGNUP: 'signup',
    VERIFY_OTP: 'verify-otp',
    LOGIN: 'login',
    REFRESH_TOKEN: 'refresh',
  },
  ARTICLES: {
    ROOT: 'articles',
    CREATE: '',
    UPDATE: ':id',
    DELETE: ':id',
    PARAM_ID: 'id',
  },
} as const;

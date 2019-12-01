export const JWT = {
  access: {
    expiresIn: 3600,
  },
  refresh: {
    expiresIn: 86400,
  },
  secret: 'secret@@',
};

export const APP_PORT = 3000;

export const HEADER_CLIENT_IP = 'x-forwarded-for';

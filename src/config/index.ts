/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DB_URL,
  ecnrytion_method: process.env.ECNRYPTION_METHOD,
  ecnrytion_key: process.env.ECNRYPTION_KEY,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUNDS,
  domain: process.env.DOMAIN,
  email_user: process.env.EMAIL_USER,
  email_password: process.env.EMAIL_PASSWORD,
  email_service: process.env.EMAIL_SERVICE,
  app_id: process.env.APP_ID,
  app_certificate: process.env.APP_CERTIFICATE,

  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRATION_TIME,
    refresh_expires: process.env.JWT_REFRESH_EXPIRATION_TIME,
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  }
};

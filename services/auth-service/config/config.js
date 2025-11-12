import dontenv from 'dotenv'
import fs from 'fs'


dontenv.config()

export const PORT=process.env.PORT;
export const PRIVATE_KEY = fs.readFileSync(
  path.resolve('./auth-service/config/private.pem'),
  'utf8'
);
export const URI=process.env.URI;
export const JWT_REFRESH_SECRET=process.env.JWT_REFRESH_SECRET;
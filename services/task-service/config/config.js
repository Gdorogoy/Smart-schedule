import dontenv from 'dotenv'
import fs from 'fs'


dontenv.config()

export const PORT=process.env.PORT;
export const PUBLIC_KEY = fs.readFileSync(
  path.resolve('./team-service/config/private.pem'),
  'utf8'
);
export const URI=process.env.URI;

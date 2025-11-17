import dotenv from 'dotenv'
import fs from 'fs'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename=fileURLToPath(import.meta.url);
const __dirname=dirname(__filename);


dotenv.config()

export const PORT=process.env.PORT;
export const PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname,'public.pem'),
  'utf8'
);

export const RABBITMQ_URL=process.env.RABBITMQ_URL;
export const URI=process.env.URI;

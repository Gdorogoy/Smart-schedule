import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Export your config
export const PORT = Number(process.env.PORT);
export const URI = process.env.URI;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const PRIVATE_KEY = fs.readFileSync(
  path.join(__dirname, "private.pem"),
  "utf8"
);


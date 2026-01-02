import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { PRIVATE_KEY } from "./config/config.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, "../public.pem"),
  "utf8"
);

const token = jwt.sign(
  { test: true },
  PRIVATE_KEY,
  {
    algorithm: "RS256",
    expiresIn: "1m",
  }
);

try {
  jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
  console.log("JWT OK – keys match");
} catch (err) {
  console.error("JWT FAILED – keys do NOT match");
  console.error(err.message);
}

import jwt from "jsonwebtoken";
import { PUBLIC_KEY } from "../config/config.js";

export const verifyRequest = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            status: "bad",
            content: "Authorization header must include Bearer token"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, PUBLIC_KEY, {
            algorithms: ["RS256"]
        });

        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(403).json({
                status: "bad",
                content: "Token expired"
            });
        }

        return res.status(401).json({
            status: "bad",
            content: "Invalid token"
        });
    }
};

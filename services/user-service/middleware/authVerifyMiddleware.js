import jwt from 'jsonwebtoken';
import {PUBLIC_KEY} from '../config/config.js';

export const verifyRequest=(req,res,next)=>{

    const headers=req.headers.authorization;

    if(!headers || !headers.startWith("Bareer")){
        return res.status(403).json({status:"bad",content:"must include jwt"});
    }

    const token=headers.split("")[1];

    try {
        const decoded = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
  }
};
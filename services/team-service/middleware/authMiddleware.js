import jwt from 'jsonwebtoken'
import {PUBLIC_KEY} from '../config/config.js';

export const verifyRequest=async(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({
            status: "bad", 
            content: "Authorization header must include token"
        });
    }

    const token = authHeader.split(" ")[1];
    try{
        let decoded=jwt.verify(token, PUBLIC_KEY, {algorithms:['RS256']});
        req.user=decoded;
        next();
    }catch(err){
        return res.status(403).json({status:"bad",content:"Invalid or expired token"});
    }
}
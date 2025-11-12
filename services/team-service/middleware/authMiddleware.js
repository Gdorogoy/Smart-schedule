import jwt from 'jsonwebtoken'
import {PUBLIC_KEY} from '../config/config.js';

export const verifyRequest=async(req,res,next)=>{
    const headers=req.headers;
    if(!headers || headers!="Bareer"){
        return res.status(403).json({status:"bad",content:"header must include jwt"});
    }

    const token=headers.split("")[1];

    try{
        let decoded=jwt.verify(token, PUBLIC_KEY, {algorithms:['RS256']});
        req.user=decoded;
        next();
    }catch(err){
        return res.status(403).json({status:"bad",content:"Invalid or expired token"});
    }
}
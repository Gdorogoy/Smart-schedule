import mongoose from "mongoose";
import { URI } from "../config/config.js";

export const connectDb =async()=>{
    try{
        await mongoose.connect(URI);
        console.log("USER SERVICE CONNECTED");
    }catch(err){
        console.error(`error in connection ${err.message}`);
    }
}
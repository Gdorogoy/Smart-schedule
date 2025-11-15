import mongoose from "mongoose";
import { URI } from "../config/config.js";

export const connectDb=async()=>{
    try{
        await mongoose.connect(URI);
        console.log("TASK SERVICE CONNECTED");
    }catch(err){
        console.log(`error in task serive ${err.message}`);
    }
}
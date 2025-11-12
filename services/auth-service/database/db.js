import mongoose from "mongoose";
import { URI } from "../config";

export const connectDb =async()=>{
    try{
        await mongoose.connect(URI);
        console.log("AUTH SERVICE CONNECTED");
    }catch(err){
        console.error(`error in connection ${err.message}`);
    }
}
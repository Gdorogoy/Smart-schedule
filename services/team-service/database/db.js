import mongoose from "mongoose";

const uri='mongodb+srv://gdorogoy:ChG9lE0COpjrMSYD@cluster0.hehajvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


export const connectDb =async()=>{
    try{
        await mongoose.connect(uri);
        console.log("TEAM SERVICE CONNECTED");
    }catch(err){
        console.error(`error in connection ${err.message}`);
    }
}
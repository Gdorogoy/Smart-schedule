import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength:1
    },
    description: {
        type: String,
        required: true,
    },
    importance: {
        type: Number,
        min:1,
        max:10,
        required: true
    },
    start: {
        type: Date,
    },
    end:{
        type: Date,
    },
    color:{
        type:String
    },
    status:{
        type:String,
        enum:[`pending`,`in-progress`,`completed`],
        required:true
    },
    belongsTo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    completedBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    assignedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team'
    },
    dueDate:{
        type: Date
    }
},{timestamps:true});


schema.set('toJSON', {
    transform:(document,objectToReturn)=>{
        objectToReturn.id=objectToReturn._id;
        delete objectToReturn._id;
        delete objectToReturn.__v;
        delete objectToReturn.updatedAt;
    }
});

export const Task=mongoose.model('Tasks',schema);



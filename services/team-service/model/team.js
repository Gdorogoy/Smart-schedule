import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },

  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ""
  },

  teamLeads: [{
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'teamlead', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],

  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'teamlead', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  joinCode:{
    type: String,
    unique: true
  }

}, { timestamps: true });

teamSchema.set('toJSON',{
    transform:(document,objectToReturn)=>{
        objectToReturn.id = objectToReturn._id;
        delete objectToReturn._id;
        delete objectToReturn.__v;
    }
});

export const Team= mongoose.model('Teams',teamSchema);
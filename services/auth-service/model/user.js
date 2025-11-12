import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 10,
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, { timestamps: true });

userSchema.set('toJSON', {
    transform: (document, objectToReturn) => {
        objectToReturn.id = objectToReturn._id;
        delete objectToReturn._id;
        delete objectToReturn.__v;
        delete objectToReturn.password;
    }
});

export const User = mongoose.model('User', userSchema);
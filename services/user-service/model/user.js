// user-service/models/userProfile.js
import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        default: ''
    },
    timeZone: {
        type: String,
        default: 'UTC'
    },
    avatar: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: ''
    },
    preferences: {
        notifications: {
            type: Boolean,
            default: true
        },
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        }
    },
    teams: [{
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
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
    }]
}, { timestamps: true });

userProfileSchema.set('toJSON', {
    transform: (document, objectToReturn) => {
        objectToReturn.id = objectToReturn._id;
        delete objectToReturn._id;
        delete objectToReturn.__v;
    }
});

export const User = mongoose.model('UserProfile', userProfileSchema);
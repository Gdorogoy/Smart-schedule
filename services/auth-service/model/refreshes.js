// auth-service/models/refreshToken.js
import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        required: true
    },
    isExpired: {
        type: Boolean,
        default: false
    },
    isRevoked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Auto-delete expired tokens after expiresAt date
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

refreshTokenSchema.set('toJSON', {
    transform: (document, objectToReturn) => {
        objectToReturn.id = objectToReturn._id;
        delete objectToReturn._id;
        delete objectToReturn.__v;
    }
});

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
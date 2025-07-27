import { Schema, model } from 'mongoose';

const Refreshtokenschema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },

    expiresAt: {
        type: Date,
        required: true
    },
}, { timestamps: true });

Refreshtokenschema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = model("RefreshToken", Refreshtokenschema);


export default RefreshToken;
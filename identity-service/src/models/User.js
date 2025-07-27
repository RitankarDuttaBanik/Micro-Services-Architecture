import mongoose from 'mongoose';
import argon from 'argon2';

const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        unique: true,
    }

}, { timestamps: true });


userschema.pre('save', async function(next) {
    if (this.isModified('password')) {
        try {
            this.password = await argon.hash(this.password);
            console.log( `The hashed password is :${this.password}`);
        } catch (error) {
            return next(error);
        }

    }
})

// creating method for compare password between registation and login.
userschema.methods.comparePassword = async function (candidate_password) {
    try {
        return await argon.verify(this.password, candidate_password);
    } catch (error) {
        throw error;
    }

}

userschema.index({ username: 'text' });

export default mongoose.model("User", userschema);
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true,
        select: false
    },
    avatar: {
        type: String,
        trim: true,
        default: ""
    },
    credits: {
        type: Number,
        required: true,
        default: 100,
        min: 0
    }
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

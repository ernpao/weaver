import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
    uuid: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    deletedAt: Date | null;
}

const UserSchema: Schema = new Schema({
    uuid: {
        type: String,
        required: [true, 'UUID is required'], // Make it mandatory
        unique: true,                         // Ensure uniqueness
        default: uuidv4,                      // Generate a v4 UUID automatically on creation
        index: true,                          // Index for faster lookups if you query by UUID
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
        index: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false, // Important: Password won't be returned by default
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null, // Default to null, indicating the document is NOT soft-deleted
        index: true,   // Index for performance when querying for active users (deletedAt: null)
    },
    // }, { timestamps: true }); // Alternative using timestamps option
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel
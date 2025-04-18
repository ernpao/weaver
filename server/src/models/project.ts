import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IProject extends Document {
    uuid: string;
    name: string;
    description?: string;
    ownerId: mongoose.Types.ObjectId;
    createdAt: Date;
    deletedAt: Date | null;
}

const ProjectSchema: Schema = new Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4,
        index: true,
    },
    name: {
        type: String,
        required: [true, 'Project name is required'],
    },
    description: {
        type: String,
        default: '',
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true,
    },
});

const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;

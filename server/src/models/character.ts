import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ICharacter extends Document {
    uuid: string;
    name: string;
    role: string;
    description?: string;
    projectId: mongoose.Types.ObjectId;
    createdAt: Date;
    deletedAt: Date | null;
}

const CharacterSchema: Schema = new Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4,
        index: true,
    },
    name: {
        type: String,
        required: [true, 'Character name is required'],
    },
    role: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        default: '',
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
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

const CharacterModel = mongoose.model<ICharacter>('Character', CharacterSchema);

export default CharacterModel;

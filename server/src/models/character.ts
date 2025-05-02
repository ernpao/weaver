import mongoose, { Schema } from 'mongoose';
import { BaseProjectResourceSchema, IProjectResourceDocument, IProjectResource } from './_baseDocument';

export interface Character extends IProjectResourceDocument {
    role?: string;
}

const CharacterSchema: Schema = new Schema({

    ...BaseProjectResourceSchema,

    role: {
        type: String,
        required: false,
        default: ''
    }
});

const CharacterModel = mongoose.model<Character>('Character', CharacterSchema);

export default CharacterModel;

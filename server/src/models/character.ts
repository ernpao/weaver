import mongoose, { Schema } from 'mongoose';
import { BaseProjectResourceSchema, IBaseProjectResource } from './_baseDocument';

export interface ICharacter extends IBaseProjectResource {
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

const CharacterModel = mongoose.model<ICharacter>('Character', CharacterSchema);

export default CharacterModel;

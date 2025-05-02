import mongoose, { Schema } from 'mongoose';
import { BaseProjectResourceSchema, IProjectResourceDocument } from './_baseDocument';

export interface Place extends IProjectResourceDocument {
    location?: string; // optional field
}

const PlaceSchema: Schema = new Schema({
    ...BaseProjectResourceSchema,

    location: {
        type: String,
        required: false,
        default: ''
    }
});

const PlaceModel = mongoose.model<Place>('Place', PlaceSchema);

export default PlaceModel;

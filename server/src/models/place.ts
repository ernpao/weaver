import mongoose, { Schema } from 'mongoose';
import { BaseProjectResourceSchema, IBaseProjectResource } from './_baseDocument';

export interface IPlace extends IBaseProjectResource {
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

const PlaceModel = mongoose.model<IPlace>('Place', PlaceSchema);

export default PlaceModel;

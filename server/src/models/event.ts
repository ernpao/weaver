import mongoose, { Schema } from 'mongoose';
import { BaseProjectResourceSchema, IProjectResourceDocument } from './_baseDocument';

export interface Event extends IProjectResourceDocument {
    timelinePosition?: number; // percentage (0-100)
}

const EventSchema: Schema = new Schema({
    ...BaseProjectResourceSchema,

    timelinePosition: {
        type: Number,
        min: 0,
        max: 100,
        default: 50,
    },
    
});

const EventModel = mongoose.model<Event>('Event', EventSchema);

export default EventModel;

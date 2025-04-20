import mongoose, { Schema } from 'mongoose';
import { BaseProjectResourceSchema, IBaseProjectResource } from './_baseModel';

export interface IEvent extends IBaseProjectResource {
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

const EventModel = mongoose.model<IEvent>('Event', EventSchema);

export default EventModel;

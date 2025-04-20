import { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IBaseModel extends Document {

    uuid: string;
    ownerUuid: string;
    name: string;
    description?: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

}

export const BaseSchema = {

    uuid: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4,
        index: true,
    },
    ownerUuid: {
        type: String,
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: [true, 'The name field is required'],
    },
    description: {
        type: String,
        default: '',
    },
    tags: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true,
    },

}


export interface IBaseProjectResource extends IBaseModel {
    projectUuid: string;
}

export const BaseProjectResourceSchema = {
    ...BaseSchema,

    projectUuid: {
        type: String,
        required: true,
        index: true,
    },

}
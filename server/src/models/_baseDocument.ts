import { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IResource {
    uuid: string;
    ownerUuid: string;
    name: string;
    description?: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface IProjectResource {
    projectUuid: string;
}

export interface IResourceDocument extends Document, IResource { }

export interface IProjectResourceDocument extends IResourceDocument, IProjectResource { }

export const BaseResourceSchema = {

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

export const BaseProjectResourceSchema = {
    ...BaseResourceSchema,

    projectUuid: {
        type: String,
        required: true,
        index: true,
    },

}
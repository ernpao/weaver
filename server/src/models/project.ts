import mongoose, { Schema } from 'mongoose';

import { IBaseDocument, BaseSchema } from './_baseDocument'

export interface IProject extends IBaseDocument {
}

const ProjectSchema: Schema = new Schema({
    ...BaseSchema,
});

const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;

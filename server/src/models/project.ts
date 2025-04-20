import mongoose, { Schema } from 'mongoose';

import { IBaseModel, BaseSchema } from './_baseModel'

export interface IProject extends IBaseModel {
}

const ProjectSchema: Schema = new Schema({
    ...BaseSchema,
});

const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;

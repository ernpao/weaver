import mongoose, { Schema } from 'mongoose';

import { IResourceDocument, BaseResourceSchema } from './_baseDocument'

export interface Project extends IResourceDocument {
}

const ProjectSchema: Schema = new Schema({
    ...BaseResourceSchema,
});

const ProjectModel = mongoose.model<Project>('Project', ProjectSchema);

export default ProjectModel;

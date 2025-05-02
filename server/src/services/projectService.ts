import ProjectModel, { Project } from '../models/project';
import { BaseService } from './_baseService';

export default class ProjectService extends BaseService<Project> {

    constructor(ownerUuid: string) {
        super(ownerUuid, ProjectModel)
    }

    async create(name: string): Promise<Project> {
        return await this._create({ name })
    }

    async update(
        uuid: string,
        name?: string,
        description?: string,
        tags?: string[]
    ) {
        await this._update(uuid, { name, description, tags })
    }

}

import { IProject } from "../models/project";
import ProjectService from "../services/projectService";
import { BaseController, ControllerResult, createRouterFromController } from "./_baseController";
import { Request, Response } from 'express';

async function _getProject(req: Request): Promise<IProject | null> {

    if (!(req.uuid) || !(req.user?.uuid)) return null;

    const service = new ProjectService(req.user.uuid)
    const project = await service.get(req.uuid)

    return project;
}


class ProjectsController extends BaseController {

    async get(req: Request, res: Response): Promise<ControllerResult> {
        let result: ControllerResult = { success: true };

        const project = await _getProject(req)
        if (project) {
            // result.data = project
        } else {
            result.success = false;
            result.error = "Project not found."
        }

        return result;
    }

    async post(req: Request, res: Response): Promise<ControllerResult> {
        let result: ControllerResult = { success: true };

        const project = await _getProject(req)
        if (project) {
            const service = new ProjectService(req.user.uuid)
            await service.update(project.uuid, req.body.name, req.body.description)
        } else {
            result.success = false;
            result.error = "Project not found."
        }

        return result;
    }

    async put(req: Request, res: Response): Promise<ControllerResult> {

        const service = new ProjectService(req.user!.uuid)
        const project = await service.create(req.body.name)

        let result: ControllerResult = { success: true };

        return result;
    }

    async delete(req: Request, res: Response): Promise<ControllerResult> {

        let result: ControllerResult = { success: true };

        const project = await _getProject(req)
        if (project) {
            const service = new ProjectService(req.user.uuid)
            await service.delete(project.uuid)
        } else {
            result.success = false;
            result.error = "Project not found."
        }

        return result;
    }

}

module.exports = createRouterFromController(new ProjectsController())
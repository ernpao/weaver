import { IProjectResourceDocument } from "../models/_baseDocument";
import { Project } from "../models/project";
import { BaseProjectResourceService } from "../services/_baseService";
import CharacterService from "../services/characterService";
import EventService from "../services/eventService";
import PlaceService from "../services/placeService";
import ProjectService from "../services/projectService";
import { BaseController, ControllerResult, createRouterFromController, handleRequest } from "./_baseController";
import { Request, Response } from 'express';
const requirePathParamUuid = require('../middleware/requirePathParamUuid')

async function _getProject(req: Request): Promise<Project | null> {

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
            result.data = project
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
            result.data = await service.update(project.uuid, req.body.name, req.body.description)
        } else {
            result.success = false;
            result.error = "Project not found."
        }

        return result;
    }

    async put(req: Request, res: Response): Promise<ControllerResult> {

        const service = new ProjectService(req.user!.uuid)
        const project = await service.create(req.body.name)

        let result: ControllerResult = { success: true, data: project };

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

const ProjectsRouter = createRouterFromController(new ProjectsController())

async function getProjectResources<T extends IProjectResourceDocument>(service: BaseProjectResourceService<T>, req: Request, res: Response) {
    return handleRequest(req, res, async (r, _) => {
        const projectUuid = req.uuid!;
        // console.log(projectUuid)
        const resources = await service.getAll({ deletedAt: null, projectUuid });
        // console.log(resources)
        return { success: true, data: resources }
    })
}

ProjectsRouter.get('/:uuid/characters', requirePathParamUuid, (req: Request, res: Response) => getProjectResources(new CharacterService(req.user!.uuid!), req, res))
ProjectsRouter.get('/:uuid/events', requirePathParamUuid, (req: Request, res: Response) => getProjectResources(new EventService(req.user!.uuid!), req, res))
ProjectsRouter.get('/:uuid/places', requirePathParamUuid, (req: Request, res: Response) => getProjectResources(new PlaceService(req.user!.uuid!), req, res))

module.exports = ProjectsRouter
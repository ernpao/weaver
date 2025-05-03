import { Event } from "../models/event";
import EventService from "../services/eventService";
import { BaseController, ControllerResult, createRouterFromController } from "./_baseController";
import { Request, Response } from 'express';

async function _getEvent(req: Request): Promise<Event | null> {

    if (!(req.uuid) || !(req.user?.uuid)) return null;

    const service = new EventService(req.user.uuid)
    const event = await service.get(req.uuid)

    return event;
}


class EventsController extends BaseController {

    async get(req: Request, res: Response): Promise<ControllerResult> {
        let result: ControllerResult = { success: true };

        const event = await _getEvent(req)
        if (event) {
            result.data = event
        } else {
            result.success = false;
            result.error = "Event not found."
        }

        return result;
    }

    async post(req: Request, res: Response): Promise<ControllerResult> {
        let result: ControllerResult = { success: true };

        const event = await _getEvent(req)

        if (event) {

            const service = new EventService(req.user.uuid)
            result.data = await service.update(
                event.uuid,
                req.body.name,
                req.body.description,
                req.body.timelinePosition,
                req.body.tags
            );

        } else {
            result.success = false;
            result.error = "Event not found."
        }

        return result;
    }

    async put(req: Request, res: Response): Promise<ControllerResult> {

        const service = new EventService(req.user!.uuid)
        const event = await service.create(req.projectUuid!, req.body.name)

        let result: ControllerResult = { success: true };

        if (event) {
            result.data = event
        } else {
            result.success = false;
            result.error = "Unable to create event."
        }

        return result;
    }

    async delete(req: Request, res: Response): Promise<ControllerResult> {

        let result: ControllerResult = { success: true };

        const event = await _getEvent(req)
        if (event) {
            const service = new EventService(req.user.uuid)
            await service.delete(event.uuid)
        } else {
            result.success = false;
            result.error = "Event not found."
        }

        return result;
    }

}

module.exports = createRouterFromController(new EventsController())
import { Place } from "../models/place";
import PlaceService from "../services/placeService";
import { BaseController, ControllerResult, createRouterFromController } from "./_baseController";
import { Request, Response } from 'express';

async function _getPlace(req: Request): Promise<Place | null> {

    if (!(req.uuid) || !(req.user?.uuid)) return null;

    const service = new PlaceService(req.user.uuid)
    const place = await service.get(req.uuid)

    return place;
}


class PlacesController extends BaseController {

    async get(req: Request, res: Response): Promise<ControllerResult> {
        let result: ControllerResult = { success: true };

        const place = await _getPlace(req)
        if (place) {
            result.data = place.toObject()
        } else {
            result.success = false;
            result.error = "Place not found."
        }

        return result;
    }

    async post(req: Request, res: Response): Promise<ControllerResult> {
        let result: ControllerResult = { success: true };

        const place = await _getPlace(req)

        if (place) {

            const service = new PlaceService(req.user.uuid)
            await service.update(
                place.uuid,
                req.body.name,
                req.body.description,
                req.body.location,
                req.body.tags
            );

        } else {
            result.success = false;
            result.error = "Place not found."
        }

        return result;
    }

    async put(req: Request, res: Response): Promise<ControllerResult> {

        const service = new PlaceService(req.user!.uuid)
        const place = await service.create(req.projectUuid!, req.body.name)

        let result: ControllerResult = { success: true };

        if (place) {
            result.data = place
        } else {
            result.success = false;
            result.error = "Unable to create place."
        }

        return result;
    }

    async delete(req: Request, res: Response): Promise<ControllerResult> {

        let result: ControllerResult = { success: true };

        const place = await _getPlace(req)
        if (place) {
            const service = new PlaceService(req.user.uuid)
            await service.delete(place.uuid)
        } else {
            result.success = false;
            result.error = "Place not found."
        }

        return result;
    }

}

module.exports = createRouterFromController(new PlacesController())
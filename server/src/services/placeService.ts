import PlaceModel, { Place } from '../models/place';
import { BaseProjectResourceService } from './_baseService';

export default class PlaceService extends BaseProjectResourceService<Place> {

    constructor(ownerUuid: string) {
        super(ownerUuid, PlaceModel)
    }

    async update(
        uuid: string,
        name?: string,
        description?: string,
        location?: string,
        tags?: string[]
    ) {
        await this._update(uuid, { name, description, location, tags })
    }

}

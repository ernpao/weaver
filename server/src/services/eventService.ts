import EventModel, { Event } from '../models/event';
import { BaseProjectResourceService } from './_baseService';

export default class EventService extends BaseProjectResourceService<Event> {

    constructor(ownerUuid: string) {
        super(ownerUuid, EventModel)
    }

    async update(
        uuid: string,
        name?: string,
        description?: string,
        timelinePosition?: number,
        tags?: string[]
    ) {
        await this._update(uuid, { name, description, timelinePosition, tags })
    }

}

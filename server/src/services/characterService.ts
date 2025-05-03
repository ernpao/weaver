import CharacterModel, { Character } from '../models/character';
import { BaseProjectResourceService } from './_baseService';

export default class CharacterService extends BaseProjectResourceService<Character> {

    constructor(ownerUuid: string) {
        super(ownerUuid, CharacterModel)
    }

    async update(
        uuid: string,
        name?: string,
        description?: string,
        role?: string,
        tags?: string[]
    ): Promise<Character | null> {
        return this._update(uuid, { name, description, role, tags })
    }

}

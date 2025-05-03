import { Character } from "../models/character";
import CharacterService from "../services/characterService";
import { BaseController, ControllerResult, createRouterFromController } from "./_baseController";
import { Request, Response } from 'express';

async function _getCharacter(req: Request): Promise<Character | null> {

    if (!(req.uuid) || !(req.user?.uuid)) return null;

    const service = new CharacterService(req.user.uuid)
    const character = await service.get(req.uuid)

    return character;
}


class CharactersController extends BaseController {

    async get(req: Request, res: Response): Promise<ControllerResult> {
        let result: ControllerResult = { success: true };

        const character = await _getCharacter(req)
        if (character) {
            result.data = character
        } else {
            result.success = false;
            result.error = "Character not found."
        }

        return result;
    }

    async post(req: Request, res: Response): Promise<ControllerResult> {
        let result: ControllerResult = { success: true };

        const character = await _getCharacter(req)

        if (character) {

            const service = new CharacterService(req.user.uuid)
            result.data = await service.update(
                character.uuid,
                req.body.name,
                req.body.description,
                req.body.role,
                req.body.tags
            );

        } else {
            result.success = false;
            result.error = "Character not found."
        }

        return result;
    }

    async put(req: Request, res: Response): Promise<ControllerResult> {

        const service = new CharacterService(req.user!.uuid)
        const character = await service.create(req.projectUuid!, req.body.name)

        let result: ControllerResult = { success: true };

        if (character) {
            result.data = character
        } else {
            result.success = false;
            result.error = "Unable to create character."
        }

        return result;
    }

    async delete(req: Request, res: Response): Promise<ControllerResult> {

        let result: ControllerResult = { success: true };

        const character = await _getCharacter(req)
        if (character) {
            const service = new CharacterService(req.user.uuid)
            await service.delete(character.uuid)
        } else {
            result.success = false;
            result.error = "Character not found."
        }

        return result;
    }

}

module.exports = createRouterFromController(new CharactersController())
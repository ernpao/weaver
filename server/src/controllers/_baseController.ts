import { Request, Response } from 'express';
const requirePathParamUuid = require('../middleware/requirePathParamUuid')

const express = require('express');

export interface ControllerResult {
    success: boolean;
    statusCode?: number;
    data?: any;
    message?: string;
    error?: any;
}

export abstract class BaseController {
    abstract get(req: Request, res: Response): Promise<ControllerResult>;
    abstract post(req: Request, res: Response): Promise<ControllerResult>;
    abstract put(req: Request, res: Response): Promise<ControllerResult>;
    abstract delete(req: Request, res: Response): Promise<ControllerResult>;
}

export async function handleRequest(req: Request, res: Response, callback: (rq: Request, rs: Response) => Promise<ControllerResult>) {

    try {

        const { success, statusCode, data, message, error } = await callback(req, res)

        const code = statusCode ?? 200;
        let jsonResponse: any = { success }

        if (data) {
            jsonResponse = { ...jsonResponse, data };
        }

        if (message) {
            jsonResponse = { ...jsonResponse, message };
        }

        if (error) {
            jsonResponse = { ...jsonResponse, error };
        }

        return res.status(code).json(jsonResponse)

    } catch (error) {

        console.error(error)

        return res.status(400).json({
            'success': false,
            error,
        })

    }


}


export function createRouterFromController(controller: BaseController) {

    const router = express.Router();

    router.put('/', async (req: Request, res: Response) => handleRequest(req, res, controller.put));
    router.get(['/', '/:uuid'], requirePathParamUuid, async (req: Request, res: Response) => handleRequest(req, res, controller.get));
    router.post(['/', '/:uuid'], requirePathParamUuid, async (req: Request, res: Response) => handleRequest(req, res, controller.post));
    router.delete(['/', '/:uuid'], requirePathParamUuid, async (req: Request, res: Response) => handleRequest(req, res, controller.delete));

    return router;
}
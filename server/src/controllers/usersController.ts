import { Request, Response } from 'express';
import UserService from '../services/userService'
import { toAuthenticatedUser } from '../models/user';
import { handleRequest } from './_baseController';
import ProjectService from '../services/projectService';


const express = require('express');
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {

    try {

        const uuid = req.uuid!;
        const service = new UserService();

        if (await service.userExists(uuid)) {

            const user = await service.getUser(uuid);

            res.json({
                'success': true,
                user,
            })

        } else {

            res.json({
                'success': false,
                'error': `User with UUID ${uuid} not found.`,
            })

        }

    } catch (error) {

        console.error(error)
        res.json({
            'success': false,
            error,
        })

    }

});


router.post('/', async (req: Request, res: Response) => {

    try {
        const uuid = req.uuid!;
        const { email, username, password } = req.body;
        const service = new UserService();

        if (await service.userExists(uuid)) {

            await service.updateUser(uuid, email, password, username)
            const updatedUser = await service.getUser(uuid)
            const updatedAuthUser = toAuthenticatedUser(updatedUser!)

            res.json({
                'success': true,
                'user': updatedAuthUser,
            })

        } else {

            res.json({
                'success': false,
                'error': `User with UUID ${uuid} not found.`,
            })

        }

    } catch (error) {

        console.error(error)

        return res.json({
            'success': false,
            error
        })

    }


});

router.delete('/', async (req: Request, res: Response) => {

    try {
        const uuid = req.uuid!;
        const service = new UserService();

        if (await service.userExists(uuid)) {

            await service.deleteUser(uuid)

            res.json({
                'success': true,
            })

        } else {

            res.json({
                'success': false,
                'error': `User with UUID ${uuid} not found.`,
            })

        }

    } catch (error) {

        return res.json({
            'success': false,
            error
        })

    }

});

router.get('/projects', async (req: Request, res: Response) => {
    return handleRequest(req, res, async (r, _) => {

        const uuid = req.uuid!;
        const service = new ProjectService(uuid)
        const projects = await service.getAll({ deletedAt: null });
        return { success: true, data: projects }

    })
})

module.exports = router;
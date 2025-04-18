import { Request, Response } from 'express';
import { AuthenticatedUser } from '../types/AuthenticatedUser';
import UserService from '../services/userService'
import { toAuthenticatedUser } from '../models/user';

const express = require('express');
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {

    const user: AuthenticatedUser = req.user;

    res.json({
        'success': true,
        user,
    })

});


router.post('/', async (req: Request, res: Response) => {

    try {

        const user: AuthenticatedUser = req.user;

        const { email, username, password } = req.body;

        const service = new UserService();

        await service.updateUser(user.uuid, email, password, username)

        const updatedUser = toAuthenticatedUser((await service.getUser(user.uuid))!)

        res.json({
            'success': true,
            'user': updatedUser,
        })

    } catch (error) {

        return res.json({
            'success': false,
            error
        })

    }


});


module.exports = router;
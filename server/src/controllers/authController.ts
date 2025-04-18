import { Request, Response } from 'express';
import { AuthenticatedUser } from '../types/AuthenticatedUser';
import UserService from '../services/userService'
import { toAuthenticatedUser } from '../models/user';


const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();


function _checkCredentials(req: Request, res: Response) {

    const { email, password } = req.body;

    // Basic validation (can add more robust validation library like class-validator)
    if (!email || !password) {
        return res.json({
            "success": false,
            "error": `Email or password missing in request.`
        })
    }

}

function _createJwt(user: AuthenticatedUser): string {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;

    // const payload: AuthenticatedUser = { uuid, email, username: username ?? email };
    const payload = user;
    const token = jwt.sign(payload, secret, { expiresIn: expiresIn, });

    const bearerToken = `Bearer ${token}`;
    console.log(bearerToken)
    return bearerToken;
}


router.post('/login', async (req: Request, res: Response) => {

    try {
        _checkCredentials(req, res);

        const { email, password } = req.body;
        const service = new UserService();

        const userExists = await service.userWithEmailExists(email)
        const userIsValid = userExists && (await service.checkPassword(email, password))

        if (!userExists || !userIsValid) {

            return res.json({
                "success": false,
                "error": `User not found: ${email}`,
                userExists,
                userIsValid
            })

        }

        // Login successful
        const user = (await service.getUserByEmail(email))!
        const authUser: AuthenticatedUser = toAuthenticatedUser(user);

        const token = _createJwt(authUser)

        return res.json({
            'success': true,
            token
        })


    } catch (error) {

        return res.json({
            'success': false,
            error
        })

    }

});

router.post('/register', async (req: Request, res: Response) => {

    try {
        _checkCredentials(req, res);

        const { email, password } = req.body;
        const service = new UserService();

        if (await service.userWithEmailExists(email)) {

            return res.json({
                "success": false,
                "error": `User already exists: ${email}`
            })

        }

        await service.create(email, password)

        return res.json({
            "success": true
        })

    } catch (error) {

        console.error(error)

        return res.json({
            'success': false,
            'error': error
        })

    }

});

router.post('/logout', async (req: Request, res: Response) => {

    return res.json({
        'success': true
    })

});

module.exports = router;
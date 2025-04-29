import { CookieOptions, Request, Response } from 'express';
import { AuthenticatedUser } from '../types/authenticatedUser';
import UserService from '../services/userService'
import { toAuthenticatedUser } from '../models/user';
const authenticate = require('../middleware/authenticate')


const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();


const invalidCredentialsResponse = {
    "success": false,
    "error": `Email or password missing in request.`
}

function _checkCredentials(req: Request): boolean {
    console.log(req.body)

    const { email, password } = req.body;
    return (!email || !password) ? false : true;

}

function _getCookieOptions(): CookieOptions {

    /*
sameSite: 'Strict'
    If your frontend is https://myapp.com and backend is https://api.myapp.com, the cookie won’t be sent between them.
    Only requests originating from the same domain will send the cookie.

sameSite: 'Lax'
    Safer, but allows GET navigation to carry cookies. For example, if a user clicks a link to your app, their session cookie will still be sent.

sameSite: 'None'
    Needed if your frontend and backend are on different domains (or even different ports in development, like localhost:3000 → localhost:5000).
    Requires secure: true, meaning it must be HTTPS.
*/

    const prodOptions: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 // 1day
    }

    const devOptions: CookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000 // 1day
    }

    const cookieOptions: CookieOptions = process.env.NODE_ENV === 'production' ? prodOptions : devOptions;
    return cookieOptions;
}

function _createJwt(user: AuthenticatedUser): string {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;

    // const payload: AuthenticatedUser = { uuid, email, username: username ?? email };
    const payload = user;
    const token = jwt.sign(payload, secret, { expiresIn: expiresIn, });

    // const bearerToken = `Bearer ${token}`;
    const bearerToken = `${token}`; // Send only the token for cookies
    return bearerToken;
}

router.post('/login', async (req: Request, res: Response) => {

    try {
        const credentialsValid = _checkCredentials(req);
        if (!credentialsValid) return res.status(400).json(invalidCredentialsResponse)

        const { email, password } = req.body;
        const service = new UserService();

        const userExists = await service.userWithEmailExists(email)
        const userIsValid = userExists && (await service.checkPassword(email, password))

        if (!userExists || !userIsValid) {

            return res.status(401).json({
                "success": false,
                // "error":  `User not found: ${email}`,
                "error": "Incorrect email or password.",
                userExists,
                userIsValid
            })

        }

        // Login successful
        const user = (await service.getUserByEmail(email))!
        const authUser: AuthenticatedUser = toAuthenticatedUser(user);

        const token = _createJwt(authUser)
        const cookieOptions = _getCookieOptions()

        res.cookie("token", token, cookieOptions)

        return res.json({
            'success': true,
            'user': authUser
        })


    } catch (error) {
        console.error(error)

        return res.status(400).json({
            'success': false,
            error
        })

    }

});

router.post('/register', async (req: Request, res: Response) => {

    try {
        const credentialsValid = _checkCredentials(req);
        if (!credentialsValid) return res.status(400).json(invalidCredentialsResponse)

        const { email, password } = req.body;
        const service = new UserService();

        if (await service.userWithEmailExists(email)) {

            return res.status(403).json({
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

        return res.status(400).json({
            'success': false,
            'error': error
        })

    }

});

router.post('/logout', async (req: Request, res: Response) => {

    try {

        const cookieOptions = _getCookieOptions()

        res.clearCookie('token', cookieOptions);

        return res.json({
            'success': true
        })


    } catch (error) {

        console.error(error)

        return res.status(400).json({
            'success': false,
            'error': error
        })
    }

});

router.get('/profile', authenticate, async (req: Request, res: Response) => {

    try {
        return res.json({ 'success': true, 'user': req.user })
    } catch (error) {

        console.error(error)
        return res.status(400).json({
            'success': false,
            'error': error
        })
    }

});

module.exports = router;
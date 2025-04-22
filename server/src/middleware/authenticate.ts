import { Request, Response, NextFunction } from 'express';
import { AuthenticatedUser } from '../types/authenticatedUser'; 

const jwt = require('jsonwebtoken');

const authenticate = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { uuid, email, username } = jwt.verify(token, process.env.JWT_SECRET);
        const user: AuthenticatedUser = { uuid, email, username };
        req.user = user;
        next();
    } catch (err) {
        res.status(403).json({
            success: false,
            error: 'Invalid token.'
        });
    }
};

module.exports = authenticate;
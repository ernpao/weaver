import { Request, Response, NextFunction } from 'express';

import { AuthenticatedUser } from '../types/AuthenticatedUser'; // Adjust path as needed

const jwt = require('jsonwebtoken');

const authenticate = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { uuid: string; email: string };
        req.user = { uuid: decoded.uuid, email: decoded.email };
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate;
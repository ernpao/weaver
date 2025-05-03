
import { Request, Response, NextFunction } from 'express';

export function logRequestUrl(req: Request, res: Response, next: NextFunction) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    console.log(`[${new Date().toISOString()}] ${req.method} ${fullUrl}`);
    next();
}

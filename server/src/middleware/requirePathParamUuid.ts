import { Request, Response, NextFunction } from 'express';

const requirePathParamUuid = (req: Request, res: Response, next: NextFunction) => {

    const uuid = req.param("uuid")
    if (uuid) {
        req.uuid = uuid
        next();
    } else {
        return res.status(400).json({
            "success": false,
            "error": "This request requires a UUID parameter."
        })
    }
}

module.exports = requirePathParamUuid
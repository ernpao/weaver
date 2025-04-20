import { Request, Response, NextFunction } from 'express';

const requireBodyParamProjectUuid = (req: Request, res: Response, next: NextFunction) => {

    // Require only for PUT requests
    if (req.method == 'PUT') {

        if (req.body.projectUuid) {

            req.projectUuid = req.body.projectUuid
            next();

        } else {
            return res.status(400).json({
                "success": false,
                "error": "This request requires a projectUuid parameter in the request body."
            })
        }

    } else {
        next();
    }

}

module.exports = requireBodyParamProjectUuid
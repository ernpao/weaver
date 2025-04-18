import { Request, Response } from 'express';
import { AuthenticatedUser } from '../types/AuthenticatedUser';

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

    const user: AuthenticatedUser = req.user;

    res.json({
        'success': true,
        user,
    })

});


module.exports = router;
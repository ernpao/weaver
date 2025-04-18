import { Request, Response } from 'express';

const express = require('express');
const router = express.Router();

router.get('/', async (_: Request, res: Response) => {

    res.json({
        'success': true,
        'message': 'Weaver Backend Server'
    })

});

module.exports = router;
import { Request, Response } from 'express';

const express = require('express');
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {

    try {

        res.status(200).json({
            'success': true
        })


    } catch (error) {

        res.status(500).json({
            'success': false
        })

    }

});

router.post('/', async (req: Request, res: Response) => {

    try {

        res.status(200).json({
            'success': true
        })


    } catch (error) {

        res.status(500).json({
            'success': false
        })

    }

});

module.exports = router;
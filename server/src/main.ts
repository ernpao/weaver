import { Request, Response } from 'express';
require('dotenv').config()
const port = parseInt(process.env.PORT == undefined ? '' : process.env.PORT)

import express, { NextFunction } from 'express';
const cors = require('cors')
const cookieParser = require('cookie-parser');

// Connect to Database
const connectDB = require('./config/database'); // Import the DB connection function
connectDB();

// Initialize Server
const app = express();


// Configure Server
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
}));



// Setup Middleware
const authenticate = require('./middleware/authenticate')
const requirePathParamUuid = require('./middleware/requirePathParamUuid')
const requireBodyParamProjectUuid = require('./middleware/requireBodyParamProjectUuid')


// Setup Routers
app.use('/', require('./controllers/indexController'))

app.use('/auth', require('./controllers/authController'))

app.use('/api/v1/users/:uuid', authenticate, requirePathParamUuid, require('./controllers/usersController'))

app.use('/api/v1/projects', authenticate, require('./controllers/projectsController'))
app.use('/api/v1/characters', authenticate, requireBodyParamProjectUuid, require('./controllers/charactersController'))
app.use('/api/v1/places', authenticate, requireBodyParamProjectUuid, require('./controllers/placesController'))
app.use('/api/v1/events', authenticate, requireBodyParamProjectUuid, require('./controllers/eventsController'))



import pool from './config/db';

app.post('/api/jobs', async (req: Request, res: Response, next) => {
    const search = req.body.search || ''; // get search string from frontend

    const query = `
      SELECT
        j.id AS job_id,
        j.valAdvertTitle AS title,
        j.txtAdvertSummary AS summary,
        j.valAdvertBullet1 AS bullet1,
        j.valAdvertBullet2 AS bullet2,
        j.valAdvertBullet3 AS bullet3,
        j.txtAdvJobTeaser AS teaser,
        j.intAdvertSalary AS salary,
        ccy.valName AS currency,
        j.urlFrontendUrl AS job_url,
        j.dttOpenDate AS open_date,
        j.dttClosedDate AS close_date,
        comp.valAdvCompanyShortDesc AS company,
        loc.valName AS location,
        ctr.valCountryName AS country
  
      FROM job j
      LEFT JOIN company comp ON j.company_id = comp.id AND comp.deleted = 0
      LEFT JOIN currency ccy ON j.selcurrency_id = ccy.id AND ccy.deleted = 0
      LEFT JOIN jobCurrentLocations jloc ON j.id = jloc.job_id AND jloc.bolDefault = 1 AND jloc.deleted = 0
      LEFT JOIN currentLocation loc ON jloc.selcurrentLocation_id = loc.id AND loc.deleted = 0
      LEFT JOIN country ctr ON loc.country_id = ctr.id
  
      WHERE j.deleted = 0
        AND j.bolAdvertise = 1
        AND (j.dttClosedDate IS NULL OR j.dttClosedDate > NOW())
        AND j.valAdvertTitle != ''
        AND (
          j.valAdvertTitle LIKE ?
          OR j.txtAdvertSummary LIKE ?
          OR j.valAdvertBullet1 LIKE ?
          OR j.valAdvertBullet2 LIKE ?
          OR j.valAdvertBullet3 LIKE ?
          OR j.txtAdvJobTeaser LIKE ?
        )
  
      ORDER BY j.dttOpenDate DESC;
    `;

    const likeSearch = `%${search}%`;

    try {
        const [rows] = await pool.query(query, [
            likeSearch,
            likeSearch,
            likeSearch,
            likeSearch,
            likeSearch,
            likeSearch
        ]);
        res.json(rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Database error' });
    }
})

// Generic 404 handler
const errorRouter = express.Router()
errorRouter.all('/*', function (req: Request, res: Response, _: NextFunction): void {

    res.status(404).json({
        'success': false,
        'error': `Cannot ${req.method} ${req.baseUrl}`
    })

});

app.use('/*', errorRouter)

/// Start Server
app.listen(port, () => console.log(`Created a new server listening on port ${port}`))

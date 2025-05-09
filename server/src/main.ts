import { Request, Response } from 'express';
require('dotenv').config()
const port = parseInt(process.env.PORT == undefined ? '' : process.env.PORT)

import express, { NextFunction } from 'express';
import { logRequestUrl } from './middleware/logRequestUrl';
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


app.use(logRequestUrl);

// Setup Routers
app.use('/', require('./controllers/indexController'))

app.use('/auth', require('./controllers/authController'))

app.use('/api/v1/users/:uuid', authenticate, requirePathParamUuid, require('./controllers/usersController'))

app.use('/api/v1/projects', authenticate, require('./controllers/projectsController'))
app.use('/api/v1/characters', authenticate, requireBodyParamProjectUuid, require('./controllers/charactersController'))
app.use('/api/v1/places', authenticate, requireBodyParamProjectUuid, require('./controllers/placesController'))
app.use('/api/v1/events', authenticate, requireBodyParamProjectUuid, require('./controllers/eventsController'))

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

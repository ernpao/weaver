require('dotenv').config()
const port = parseInt(process.env.PORT == undefined ? '' : process.env.PORT)

import express from 'express';
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors')

/// Connect to Database
const connectDB = require('./config/database'); // Import the DB connection function
connectDB();

/// Initialize Server
const app = express();



app.use(express.json({ limit: '10mb' }))
app.use(cors());


/// Setup Middleware
const authenticate = require('./middleware/jwtMiddleware')


/// Setup Routers
app.use('/', require('./controllers/indexController'))

app.use('/auth', require('./controllers/authController'))

app.use('/users', authenticate, require('./controllers/usersController'))



/// Start Server
app.listen(port, () => console.log(`Created a new server listening on port ${port}`))

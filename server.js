const express = require('express');
const dontenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars

dontenv.config({ path: './config/config.env' });

// Connect to Database
connectDB();


// Route Files
const bootcamps = require('./routes/bootcamps');

const app = express();
// Body Parser
app.use(express.json());
// Dev login middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(
                    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} Mode on port ${PORT}`.yellow.bold));
                    
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // close server & exit process
    server.close(() => process.exit(1));
})
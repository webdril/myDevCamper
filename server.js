const express = require('express');
const dontenv = require('dotenv');


// Load env vars

dontenv.config({ path: './config/config.env' });

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} Mode on port ${PORT}`));
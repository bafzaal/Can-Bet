// Import all dependencies 
const dotenv = require('dotenv');
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Might not use this, depending on time

const app = express();

// Configure ENV file and require conn.js
dotenv.config({path : './config.env'});
require('./db/conn');

app.get('/', (req, res) => {
    res.send("test"); 
})

// Run the server
app.listen(3001, () => {
    console.log("Server Started")
})
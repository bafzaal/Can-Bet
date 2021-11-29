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
const port = process.env.PORT;

const Users = require('./models/userSchema');

// Will be used to get data from the frontend
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send("test"); 
})

// Register
app.post('/register', async (req, res) => {
    try {
        // Get Data
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        
        const createUser = new Users({
            username : username,
            email : email,
            password : password
        });

        // save will create or insert the user after hashing, then it will save to db
        const created = await createUser.save();
        console.log(created);
        res.status(200).send("Registration Complete");
        
    } catch (error) {
        res.status(400).send(error);
    }
})

// Run the server
app.listen(port, () => {
    console.log("Server Started")
})
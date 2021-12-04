// Import all dependencies
const dotenv = require("dotenv");
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = express();

app.use(cors())

// Configure ENV file and require conn.js
dotenv.config({ path: "./config.env" });
require("./db/conn");
const port = process.env.PORT;

const Users = require("./models/userSchema");
const authenticate = require("./authentication/authenticate");

// Will be used to get data from the frontend
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("test");
});

// Register
app.post("/register", async (req, res) => {
  try {
    // Get Data
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const createUser = new Users({
      username: username,
      email: email,
      password: password,
    });
    console.log(req.body)
    // save will create or insert the user after hashing, then it will save to db
    const created = await createUser.save();
    console.log(created)
    res.status(200).send("Registration Complete");
  } catch (error) {
    res.status(400).send(error);
  }
});

// Log in
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Find User
    const user = await Users.findOne({ email: email }); 
    if (user) {
      // Check Password
      const match = await bcryptjs.compare(password, user.password);

      if (match) {
        // Call the gen JWT function
        const token = await user.generateToken();
        res.cookie("jwt", token, {
          // Expires after 12 hours
          expires: new Date(Date.now() + 43200000), // 43200000 ms = 12 hours
          httpOnly: true,
        });
        res.status(200).send("Log In Successful");
      } else {
        res.status(400).send("Incorrect Password");
      }
    } else {
      res.status(400).send("Incorrect Email/Username"); // FIX THIS LATER
    }
  } catch (error) {
    res.status(400).send(error);
  }
});


// Log out
app.get("/logout", async (req, res) => {
  res.status(202).clearCookie("jwt").send('Clearing cookie');
});

// authentcation
app.get("/authentication", async (req, res) => {
  var authenticated = await authenticate(req, res)

  if(authenticated){
  
    res.status(200).send('Authenticated')
  }else{
    res.status(401).send('Not Authenticated')
  }
});


// Run the server
app.listen(port, () => {
  console.log("Server Started");
});
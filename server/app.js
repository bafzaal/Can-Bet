// Import all dependencies
const dotenv = require("dotenv");
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const cors = require('cors');
const app = express();

var bets = require("./api/bets");


app.use(cors())
app.use(fileupload());
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
  var id = await authenticate(req, res)
  if(id != null){
  
    res.status(200).json({result:id})
  }else{
    res.status(401).json({result:null})
  }
});

// get User
app.get("/profile", async (req, res) => {

try{
    //if not null 
  const user = await Users.findById(req.query.id).exec();
  if(user)
    res.json(user);
    } catch(e) {
      console.log('error:-', e)
  }
});

// delete User
app.delete("/profile", async (req, res) => {
  try{
    //if not null 
  const password = req.body.password;
  const user = await Users.findById(req.query.id).exec();
  if(user){
     // Check Password
     const match = await bcryptjs.compare(password, user.password);
     if (match) {
       await user.remove();
       res.status(200).send("Updated Successfully");
     } else {
       res.status(400).send("Incorrect Password");
     }
    } 
  }catch(e) {
    console.log('error:-', e)
  }
});

// Update user
app.post("/newPassword", async (req, res) => {
  //console.log(req.body)
  try {
    const userId = req.body.id;
    const password = req.body.oldPassword;
    const newpassword = req.body.password;
    const username = req.body.username;
    const email = req.body.email
   
    // Find User
    const user = await Users.findById(userId).exec();
    if (user) {
      // Check Password
      const match = await bcryptjs.compare(password, user.password);
      if (match) {
        if(newpassword != null &&  newpassword != "")
          user.password = newpassword;
        user.username = username;
        user.email = email;
        await user.save();
        res.status(200).send("Updated Successfully");
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


// Run the server
app.listen(port, () => {
  console.log("Server Started");
});


app.use("/", bets);

module.exports = app;
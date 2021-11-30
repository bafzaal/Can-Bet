const Users = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res) => {
  const cookie = req.cookies.jwt;
  if (!cookie) {

   
    return false;

  } else {
    const id = jwt.verify(cookie, process.env.SECRET_KEY);
    const user = await Users.findById(id["_id"]).exec();

    if (user) {
 
      return true;
    }
  
    
  }
  return false;
  next();
};

module.exports = authenticate;
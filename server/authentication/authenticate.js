const Users = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res) => {
  const cookie = req.cookies.jwt;
  if (!cookie) {

    return null;

  } else {
    const id = jwt.verify(cookie, process.env.SECRET_KEY);
    const userId = id["_id"]
    const user = await Users.findById(userId).exec();
    if (user) {
      return {"id":userId, "email":user.email};
    }
  
  }
  return null;
  next();
};

module.exports = authenticate;
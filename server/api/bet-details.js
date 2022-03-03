const express = require("express");
const Bets = require("../models/betsSchema");
const Users = require("../models/userSchema");

var router = express.Router();

router.get("/api/display-stats", async (req, res) => {
  let id = req.query.id;
  let filterParam = req.query.filter;

  let sports = ["NHL", "NBA", "NFL"];
  let betTypes = ["moneyline", "spread", "parlay"];

  const user = await Users.findById(id).exec();

  if (filterParam == "overall") {
    return res
      .status(200)
      .json({ success: true, result: user.stats.overall.all });
  } else if (sports.includes(filterParam)) {
    let result = user.stats.sports[filterParam];
    return res.status(200).json({ success: true, result: result });
  } else if (betTypes.includes(filterParam)) {
    let result = user.stats.betTypes[filterParam];
    return res.status(200).json({ success: true, result: result });
  }

  return res.status(400).json({ success: false });
});

router.get("/api/display-bets", async (req, res) => {
  let id = req.query.id;
  let filterParam = req.query.filter;

  let sports = ["NHL", "NBA", "NFL"];
  let betTypes = ["Moneyline", "Spread", "Parlay"];

  try {
    if (filterParam == "overall") {
      const bets = await Bets.find({ userId: id });

      return res.status(200).json({ success: true, result: bets });
    } else if (sports.includes(filterParam)) {
      const bets = await Bets.find({
        size: 1,
        userId: id,
        "betContents.sport": filterParam,
      });

      return res.status(200).json({ success: true, result: bets });
    } else if (betTypes.includes(filterParam)) {
      const bets = await Bets.find({ userId: id, type: filterParam });

      return res.status(200).json({ success: true, result: bets });
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  return res.status(400).json({ success: false });
});

router.get("/api/display-leaderboard", async (req, res) => {
  let filterParam = req.query.filter;

  let sports = ["NHL", "NBA", "NFL"];
  let betTypes = ["moneyline", "spread", "parlay"];

  try {
    if (filterParam == "overall") {
      const stats = await Users.find()
        .select({ "stats.overall.all": 1, _id: 1, username: 1 })
        .exec();

      return res.status(200).json({ success: true, result: stats });
    } else if (sports.includes(filterParam)) {
      const stats = await Users.find()
        .select({ "stats.sports": 1, _id: 1, username: 1 })
        .exec();

      return res.status(200).json({ success: true, result: stats });
    } else if (betTypes.includes(filterParam)) {
      const stats = await Users.find()
        .select({ "stats.betTypes": 1, _id: 1, username: 1 })
        .exec();
        return res.status(200).json({ success: true, result: stats });
      }
  } catch (error) {
    console.log(error)
    return res.status(400).send(error);
  }

  return res.status(400).json({ success: false });
});


router.get("/api/username", async (req, res) => {
  let id = req.query.id;
  const user = await Users.findById(id).exec();
  if(user){
    return res.status(200).json({ success: true, result: user.username });

  }
  return res.status(400).json({ success: false });


});

module.exports = router;

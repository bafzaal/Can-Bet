const express = require("express");
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

module.exports = router;

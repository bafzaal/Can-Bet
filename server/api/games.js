const express = require("express");
var router = express.Router();

const gameSchema = require("../models/gameSchema");

router.get("/api/games", async(req, res) => {
    let league = req.query.league;
    let date = req.query.date
    res.send(`league: ${league}, date: ${date}`)
})

module.exports = router;
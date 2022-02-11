const express = require("express");
var router = express.Router();

const gameSchema = require("../models/gameSchema");

router.get("/api/games", async(req, res) => {
    let league = req.query.league;
    let date = req.query.date
    console.log(`GET /api/games?league=${league}&date=${date}`)
    gameSchema.find({ league: league, day_string: date }, (err, docs) => {
        if (err) {
            res.status(500).send("Internal Server Error")
        } else {
            res.send(docs);
        }
    })
})

module.exports = router;
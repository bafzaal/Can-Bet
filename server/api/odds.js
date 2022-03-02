const express = require("express");
var router = express.Router();

const oddsSchema = require("../models/oddsSchema")

router.get("/api/odds", async(req, res) => {
    let league = req.query.league;
    let date = req.query.date
    console.log(`${new Date()}: GET /api/odds?league=${league}&date=${date}`)
    oddsSchema.find({ league: league, day_string: date }, (err, docs) => {
        if (err) {
            res.status(500).send("Internal Server Error")
        } else {
            res.send(docs);
        }
    })
})

module.exports = router;
const express = require("express");
var router = express.Router();

const gameSchema = require("../models/gameSchema");
const oddsSchema = require("../models/oddsSchema");

router.get("/api/games", async(req, res) => {
    let league = req.query.league;
    let date = req.query.date

    console.log(`${new Date()}: GET /api/games?league=${league}&date=${date}`)

    async function run() {
        try {
            getGames(league, date, res, getOdds)
        } catch (e) {
            res.status(500).send("Internal Server Error")
        }
    }

    async function getGames(league, date, res, callback) {
        let filter = league == "all" ? { day_string: date } : { league: league, day_string: date }
        gameSchema.find(filter, (err, docs) => {
            if (err) {
                res.status(500).send("Internal Server Error")
            } else {
                callback(docs, res)
            }
        })
    }

    async function getOdds(games, res) {
        let filter = league == "all" ? { day_string: date } : { league: league, day_string: date }
        oddsSchema.find(filter, (err, docs) => {
            if (err) {
                res.status(500).send("Internal Server Error")
            } else {
                res.send({
                    games: games,
                    odds: docs
                });
            }
        })
    }

    run()
})

module.exports = router;
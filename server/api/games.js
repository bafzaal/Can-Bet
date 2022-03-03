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

router.delete("/api/games", async(req, res) => {
    console.log("DELETE: /api/games")
    gameSchema.remove({ league: req.body.league }, (err) => {
        res.send("success")
    })
})

router.delete("/api/odds", async(req, res) => {
    console.log("DELETE: /api/odds")
    oddsSchema.remove({ league: req.body.league, book: req.body.book }, (err) => {
        res.send("success")
    })
})

module.exports = router;
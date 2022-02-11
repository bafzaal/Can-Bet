const express = require("express");
const axios = require("axios");
var router = express.Router();

const GameSchema = require("../models/gameSchema");

router.get("/api/run/script/schedule/nba", async(req, res) => {
    console.log("GET /api/run/script/schedule/nba")
    const end_date = new Date("2022-04-11")
    var daysOfYear = [];
    for (var d = new Date(); d <= end_date; d.setDate(d.getDate() + 1)) {
        d_string = d.getFullYear().toString() + formatNumber(d.getMonth() + 1) + formatNumber(d.getDate())
        await submitSchedule("basketball", "nba", d_string, res);
        daysOfYear.push(d_string);
    }
    res.send(daysOfYear)
});

router.get("/api/run/script/schedule/nhl", async(req, res) => {
    console.log("GET /api/run/script/schedule/nhl")
    const end_date = new Date("2022-04-30")
    var daysOfYear = [];
    for (var d = new Date(); d <= end_date; d.setDate(d.getDate() + 1)) {
        d_string = d.getFullYear().toString() + formatNumber(d.getMonth() + 1) + formatNumber(d.getDate())
        await submitSchedule("hockey", "nhl", d_string, res);
        daysOfYear.push(d_string);
    }
    res.send(daysOfYear)
})

function formatNumber(number) {
    return ("0" + number).toString().slice(-2)
}

async function submitSchedule(sport, league, date, res) {
    var config = {
        method: 'get',
        url: `https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=${sport}&league=${league}&region=us&lang=en&contentorigin=espn&buyWindow=1m&showAirings=buy%2Clive%2Creplay&showZipLookup=true&tz=America%2FNew_York&dates=${date}`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
            'Accept': '*/*',
            'Accept-Language': 'en-CA,en-US;q=0.7,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.espn.com/',
            'Origin': 'https://www.espn.com',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'TE': 'trailers'
        }
    };

    axios(config)
        .then(function(response) {
            let events = response.data.sports[0].leagues[0].events;
            if (events !== undefined) {
                let gameObjects = events.map((event) => {
                    home = event.competitors.filter((x) => { return x.homeAway == "home" })[0]
                    away = event.competitors.filter((x) => { return x.homeAway == "away" })[0]
                    return {
                        espnId: event.id,
                        time: event.date,
                        time_summary: event.summary,
                        day_string: date,
                        league: league,
                        home_team: home.displayName,
                        home_team_abbr: home.abbreviation,
                        home_score: home.score,
                        away_team: away.displayName,
                        away_team_abbr: away.abbreviation,
                        away_score: away.score,
                        espn_link: event.link,
                        game_over: event.fullStatus.type.completed
                    }
                })
                GameSchema.insertMany(gameObjects, (err) => {
                    if (err) {
                        res.status(500).send("Internal Server Error")
                    } else {
                        return true;
                    }
                })
            }
        })
        .catch(function(error) {
            console.log(error);
            res.status(500).send("Internal server error")
        });
}

module.exports = router;
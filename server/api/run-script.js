const express = require("express");
const axios = require("axios");
var router = express.Router();

const GameSchema = require("../models/gameSchema");
const OddsSchema = require("../models/oddsSchema");

const PROLINE_NBA = require("../script-configs/proline_NBA")
const PROLINE_NHL = require("../script-configs/proline_NHL")

const PROLINE_configs = {
    "nhl": PROLINE_NHL,
    "nba": PROLINE_NBA
}

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

router.get("/api/run/script/odds", async(req, res) => {
    let league = req.query.league;
    console.log(`${new Date()}: GET /api/run/script/odds?league=${league}`)
    var config = PROLINE_configs[league]

    axios(config)
        .then(function(response) {
            items_arr = Object.entries(response.data.items)
            items = items_arr.map(([key, value]) => { // need to map the id of the items into their object, instead of as a key-value pair
                obj = value
                value.id = key
                return obj
            })
            e_items = items.filter((x) => { return x.type == "EventDataItem" })
            m_items = items.filter((x) => { return x.type == "MarketDataItem" })
            o_items = items.filter((x) => { return x.type == "OutcomeDataItem" && x.desc == x.teamDescription })
            oddsObjects = o_items.map((item) => {
                market = m_items.filter((x) => { return item.parent == x.id })[0]
                game = e_items.filter((x) => { return market.parent == x.id })[0]
                d = new Date(game.startDateTime)
                d_string = d.getFullYear().toString() + formatNumber(d.getMonth() + 1) + formatNumber(d.getDate())
                obj = {
                    league: league,
                    home_team: game.a,
                    away_team: game.b,
                    day_string: d_string,
                    team: item.teamDescription,
                    price: item.price,
                    book: "Proline+"
                }
                return obj
            })
            OddsSchema.insertMany(oddsObjects, (err) => {
                if (err) {
                    res.status(500).send("Internal Server Error")
                } else {
                    res.send({
                        league: league,
                        games: e_items.length
                    })
                }
            })
        })
        .catch(function(error) {
            console.log(error);
        });
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
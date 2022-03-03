const express = require("express");
const axios = require("axios");
var router = express.Router();
const csv = require("csv-parser");
const { Readable } = require("stream");

const GameSchema = require("../models/gameSchema");
const OddsSchema = require("../models/oddsSchema");
const TeamMappings = require("../models/teamMapSchema")

const PROLINE_NBA = require("../script-configs/Proline/proline_NBA")
const PROLINE_NHL = require("../script-configs/Proline/proline_NHL")
const PROLINE_NCAAM = require("../script-configs/Proline/proline_NCAAM")
const BODOG_NBA = require("../script-configs/bodog_NBA")
const BODOG_NHL = require("../script-configs/bodog_NHL")
const BET99_NBA = require("../script-configs/bet99_NBA")
const BET99_NHL = require("../script-configs/bet99_NHL")

const PROLINE_configs = {
    "nhl": PROLINE_NHL,
    "nba": PROLINE_NBA,
    "mens-college-basketball": PROLINE_NCAAM
}

const BODOG_configs = {
    "nhl": BODOG_NHL,
    "nba": BODOG_NBA
}

const BET99_configs = {
    "nhl": BET99_NHL,
    "nba": BET99_NBA
}

const END_DATES = {
    "nhl": new Date("2022-04-30"),
    "nba": new Date("2022-04-11"),
    "mens-college-basketball": new Date("2022-03-7")
}

const SPORTS = {
    "nhl": "hockey",
    "nba": "basketball",
    "mens-college-basketball": "basketball"
}

router.post("/api/run/script/team/mappings", async(req, res) => {
    console.log(`${new Date()}: POST /api/run/script/team/mappings`)
    if (!req.files) {
        res.send("File was not found");
        return;
    }
    const file = req.files.file;

    const bufferStream = Readable.from(file.data.toString());
    const results = [];

    bufferStream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
            mappings = results.map((result) => {
                return {
                    book: result.Book,
                    league: result.League,
                    value: result.Value,
                    mapping: result.Mapping
                }
            })
            TeamMappings.insertMany(mappings, (err) => {
                if (err) {
                    res.status(500).send("Internal Server Error")
                } else {
                    res.send(mappings)
                }
            })
        });
})

router.get("/api/run/script/schedule", async(req, res) => {
    let league = req.query.league
    let timestamp = new Date()
    console.log(`${timestamp}: GET /api/run/script/schedule?league=${league}`)
    const end_date = END_DATES[league]
    var daysOfYear = [];
    for (var d = new Date(); d <= end_date; d.setDate(d.getDate() + 1)) {
        d_string = d.getFullYear().toString() + formatNumber(d.getMonth() + 1) + formatNumber(d.getDate())
        await submitSchedule(SPORTS[league], league, d_string, timestamp, res);
        daysOfYear.push(d_string);
    }
    res.send(daysOfYear)
});

router.get("/api/run/script/odds/proline", async(req, res) => {
    let league = req.query.league;
    let timestamp = new Date();

    console.log(`${timestamp}: GET /api/run/script/odds/proline?league=${league}`)

    async function run() {
        try {
            getMappings(league, res, getProlineOdds)
        } catch (e) {
            res.status(500).send("Internal Server Error")
        }
    }

    async function getMappings(league, res, callback) {
        TeamMappings.find({ league: league }, (err, docs) => {
            if (err) {
                res.status(500).send("Internal Server Error")
            } else {
                callback(league, docs, res)
            }
        })
    }

    async function getProlineOdds(league, mappings, res) {
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
                        home_team: teamMap(game.a, mappings),
                        away_team: teamMap(game.b, mappings),
                        day_string: d_string,
                        team: teamMap(item.teamDescription, mappings),
                        price: item.price,
                        book: "Proline+",
                        timestamp: timestamp
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
    }

    run()
})

router.get("/api/run/script/odds/bodog", async(req, res) => {
    let league = req.query.league
    var config = BODOG_configs[league]
    let timestamp = new Date()

    console.log(`${timestamp}: GET /api/run/script/odds/bodog?league=${league}`)

    axios(config)
        .then(function(response) {
            let items = response.data[0].events
            let oddsObjects = items.map((event) => {
                let home_team = event.competitors.filter((x) => { return x.home })[0]
                let away_team = event.competitors.filter((x) => { return !x.home })[0]
                let outcomes = event.displayGroups[0].markets.filter((x) => { return x.description == "Moneyline" })[0].outcomes
                d = new Date(event.startTime)
                d_string = d.getFullYear().toString() + formatNumber(d.getMonth() + 1) + formatNumber(d.getDate())
                return [{
                        league: league,
                        home_team: home_team.name,
                        away_team: away_team.name,
                        day_string: d_string,
                        team: outcomes[0].description,
                        price: outcomes[0].price.decimal,
                        book: "bodog",
                        timestamp: timestamp
                    },
                    {
                        league: league,
                        home_team: home_team.name,
                        away_team: away_team.name,
                        day_string: d_string,
                        team: outcomes[1].description,
                        price: outcomes[1].price.decimal,
                        book: "bodog",
                        timestamp: timestamp
                    }
                ]
            })
            flattened_odds = oddsObjects.flat()
            OddsSchema.insertMany(flattened_odds, (err) => {
                if (err) {
                    res.status(500).send("Internal Server Error")
                } else {
                    res.send({
                        league: league,
                        games: items.length
                    })
                }
            })
        })
        .catch(function(error) {
            console.log(error);
        });

})

router.get("/api/run/script/odds/bet99", async(req, res) => {
    let league = req.query.league
    var config = BET99_configs[league]
    let timestamp = new Date()

    console.log(`${timestamp}: GET /api/run/script/odds/bet99?league=${league}`)

    async function run() {
        try {
            getMappings(league, res, getOdds)
        } catch (e) {
            res.status(500).send("Internal Server Error")
        }
    }

    async function getMappings(league, res, callback) {
        TeamMappings.find({ league: league }, (err, docs) => {
            if (err) {
                res.status(500).send("Internal Server Error")
            } else {
                callback(league, docs, res)
            }
        })
    }

    async function getOdds(league, mappings, res) {
        axios(config)
            .then(function(response) {
                items = response.data.Result.Items[0].Events
                oddsObjects = items.map((item) => {
                    home_team = item.Name.split(" vs. ")[0]
                    away_team = item.Name.split(" vs. ")[1]
                    d = new Date(item.EventDate)
                    d_string = d.getFullYear().toString() + formatNumber(d.getMonth() + 1) + formatNumber(d.getDate())
                    return [{
                            league: league,
                            home_team: teamMap(home_team, mappings),
                            away_team: teamMap(away_team, mappings),
                            day_string: d_string,
                            team: teamMap(item.Items[0].Items[0].Name, mappings),
                            price: item.Items[0].Items[0].Price,
                            book: "Bet99",
                            timestamp: timestamp
                        },
                        {
                            league: league,
                            home_team: teamMap(home_team, mappings),
                            away_team: teamMap(away_team, mappings),
                            day_string: d_string,
                            team: teamMap(item.Items[0].Items[1].Name, mappings),
                            price: item.Items[0].Items[1].Price,
                            book: "Bet99",
                            timestamp: timestamp
                        }
                    ]
                })
                flattened_odds = oddsObjects.flat()
                OddsSchema.insertMany(flattened_odds, (err) => {
                    if (err) {
                        res.status(500).send("Internal Server Error")
                    } else {
                        res.send({
                            league: league,
                            games: items.length
                        })
                    }
                })
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    run()
})

function formatNumber(number) {
    return ("0" + number).toString().slice(-2)
}

function teamMap(name, mappings) {
    mapping = mappings.filter((x) => { return x.value == name })[0]
    if (mapping) {
        return mapping.mapping
    } else {
        return name
    }
}

async function submitSchedule(sport, league, date, timestamp, res) {
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
                        league: league == "mens-college-basketball" ? "ncaam" : league,
                        home_team: home.displayName,
                        home_team_abbr: home.abbreviation,
                        home_logo: home.logo,
                        home_rank: home.rank,
                        home_score: home.score,
                        away_team: away.displayName,
                        away_team_abbr: away.abbreviation,
                        away_logo: away.logo,
                        away_rank: away.rank,
                        away_score: away.score,
                        espn_link: event.link,
                        game_over: event.fullStatus.type.completed,
                        timestamp: timestamp
                    }
                })
                GameSchema.insertMany(gameObjects, (err) => {
                    if (err) {
                        console.log(err)
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
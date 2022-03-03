const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    espnId: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    time_summary: {
        type: String,
        required: true
    },
    day_string: {
        type: String,
        required: true
    },
    league: {
        type: String,
        required: true
    },
    home_team: {
        type: String,
        required: true
    },
    home_team_abbr: {
        type: String,
        required: true
    },
    home_logo: {
        type: String,
        required: false
    },
    home_rank: {
        type: String,
        required: false
    },
    home_score: {
        type: Number,
        required: false
    },
    away_team: {
        type: String,
        required: true
    },
    away_team_abbr: {
        type: String,
        required: true
    },
    away_logo: {
        type: String,
        required: false
    },
    away_rank: {
        type: String,
        required: false
    },
    away_score: {
        type: Number,
        required: false
    },
    espn_link: {
        type: String,
        required: false
    },
    game_over: {
        type: Boolean,
        required: true,
        default: false
    },
    clock: {
        type: String,
        require: false
    },
    timestamp: {
        type: Date,
        required: true
    }
});

// Create the model
const Game = new mongoose.model("GAME", gameSchema);

module.exports = Game;
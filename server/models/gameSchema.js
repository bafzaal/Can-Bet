const { truncate } = require("fs");
const mongoose = require("mongoose");
const { StringDecoder } = require("string_decoder");

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
    }
});

// Create the model
const Game = new mongoose.model("GAME", gameSchema);

module.exports = Game;
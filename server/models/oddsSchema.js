const mongoose = require("mongoose");

const oddsSchema = new mongoose.Schema({
    league: {
        type: String,
        required: true
    },
    home_team: {
        type: String,
        required: true
    },
    away_team: {
        type: String,
        required: true
    },
    day_string: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    book: {
        type: String,
        required: true
    }
});

// Create the model
const Odds = new mongoose.model("ODDS", oddsSchema);

module.exports = Odds;
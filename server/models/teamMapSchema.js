const mongoose = require("mongoose");

const teamMapSchema = new mongoose.Schema({
    book: {
        type: String,
        required: true
    },
    league: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    mapping: {
        type: String,
        required: true
    }
});

// Create the model
const TeamMaps = new mongoose.model("TeamMappings", teamMapSchema);

module.exports = TeamMaps;
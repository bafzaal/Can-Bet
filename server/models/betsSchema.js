const mongoose = require("mongoose");

// Document structure (Usually known as schema but MongoDB doesnt have a set schema)
const betsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  size: {
    type: Number,
    required: true,
  },
  totalOdds: {
    type: Number,
    required: true,
  },
  stake: {
    type: Number,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  payout: {
    type: String,
    required: true,
  },
  sportsbook: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  betContents: [
    {
      type: {
        type: String,
      },
      sport: {
        type: String,
      },
      date: {
        type: String,
      },
      selection: {
        type: String,
      },
      odds: {
        type: Number,
      },
      result: {
        type: String,
      },
      homeTeam: {
        type: String,
      },
      awayTeam: {
        type: String,
      },
      homeSpread: {
        type: Number,
      },
      awaySpread: {
        type: Number,
      },
    },
  ],
});



// Create the model
const Bets = new mongoose.model("BETS", betsSchema);

module.exports = Bets;

const express = require("express");
const csv = require("csv-parser");
const { Readable } = require("stream");
const authenticate = require("../authentication/authenticate");
const Bets = require("../models/betsSchema");

var router = express.Router();

router.post("/api/place-bets-file", (req, res) => {
  let id = req.body.id;

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
      AddToDB(results, id);
    });

  return res.status(200).json({ success: true });
});

async function AddToDB(results, id) {
  let parlayBetCount = 0;
  let betCollection = [];
  let createBets = new Bets({});

  for (let i = 0; i < results.length; i++) {
    let bet = results[i];

    if (bet.TYPE != "Parlay" && parlayBetCount == 0) {
      betCollection = [];
      const betDetails = {
        type: bet.TYPE,
        sport: bet.Sport,
        date: bet.Date,
        selection: bet.Selection,
        odds: bet.Odds,
        result: bet.Result,
        homeTeam: bet.Home,
        awayTeam: bet.Away,
        homeSpread: bet.HomeSpread,
        awaySpread: bet.AwaySpread,
      };

      betCollection.push(betDetails);

      createBets = new Bets({
        userId: id,
        size: bet.Size,
        totalOdds: bet.Odds,
        stake: bet.Stake,
        result: bet.Result,
        payout: bet.Payout,
        sportsbook: bet.Sportsbook,
        type: bet.TYPE,
        betContents: betCollection,
      });

      const created = await createBets.save();
      console.log(created);
    } else if (bet.TYPE == "Parlay" || parlayBetCount >= 0) {
      if (parlayBetCount == 0) {
        parlayBetCount = bet.Size;
        betCollection = [];

        createBets = new Bets({
          userId: id,
          size: bet.Size,
          totalOdds: bet.Odds,
          stake: bet.Stake,
          result: bet.Result,
          payout: bet.Payout,
          sportsbook: bet.Sportsbook,
          type: bet.TYPE,
        });
      } else {
        --parlayBetCount;

        const betDetails = {
          type: bet.TYPE,
          sport: bet.Sport,
          date: bet.Date,
          selection: bet.Selection,
          odds: bet.Odds,
          result: bet.Result,
          homeTeam: bet.Home,
          awayTeam: bet.Away,
          homeSpread: bet.HomeSpread,
          awaySpread: bet.AwaySpread,
        };
        betCollection.push(betDetails);

        if (parlayBetCount == 0) {
          createBets.betContents = betCollection;
          betCollection = [];

          const created = await createBets.save();
          console.log(created);
        }
      }
    }
  }
}

module.exports = router;

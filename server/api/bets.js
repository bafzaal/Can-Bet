const express = require("express");
const csv = require("csv-parser");
const { Readable } = require("stream");
const authenticate = require("../authentication/authenticate");
const Bets = require("../models/betsSchema");
const stats = require("../db/stats");
const Users = require("../models/userSchema");
const math = require('mathjs');

var router = express.Router();

router.post("/api/place-bets-file", async (req, res) => {
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
  
  await stats.updateStats(id);
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
        sport: bet.SPORT,
        date: bet.DATE,
        selection: bet.SELECTION,
        odds: bet.ODDS,
        result: bet.RESULT,
        homeTeam: bet.HOME,
        awayTeam: bet.AWAY,
        homeSpread: bet.HOMESPREAD,
        awaySpread: bet.AWAYSPREAD,
      };

      betCollection.push(betDetails);

      createBets = new Bets({
        userId: id,
        size: bet.SIZE,
        totalOdds: bet.ODDS,
        stake: bet.STAKE,
        result: bet.RESULT,
        payout: bet.PAYOUT,
        sportsbook: bet.SPORTSBOOK,
        type: bet.TYPE,
        betContents: betCollection,
      });
      console.log(createBets)
      const created = await createBets.save();
      await stats.updateStats(id);
      console.log(created);
    } else if (bet.TYPE == "Parlay" || parlayBetCount >= 0) {
      if (parlayBetCount == 0) {
        parlayBetCount = bet.SIZE.trim();
        betCollection = [];

        createBets = new Bets({
          userId: id,
          size: bet.SIZE.trim(),
          totalOdds: bet.ODDS.trim(),
          stake: bet.STAKE.trim(),
          result: bet.RESULT.trim(),
          payout: bet.PAYOUT.trim(),
          sportsbook: bet.SPORTSBOOK.trim(),
          type: bet.TYPE.trim(),
        });
      } else {
        --parlayBetCount;

        const betDetails = {
          type: bet.TYPE.trim(),
          sport: bet.SPORT.trim(),
          date: bet.DATE.trim(),
          selection: bet.SELECTION.trim(),
          odds: bet.ODDS.trim(),
          result: bet.RESULT.trim(),
          homeTeam: bet.HOME.trim(),
          awayTeam: bet.AWAY.trim(),
          homeSpread: bet.HOMESPREAD.trim(),
          awaySpread: bet.AWAYSPREAD.trim(),
        };
        betCollection.push(betDetails);

        if (parlayBetCount == 0) {
          createBets.betContents = betCollection;
          betCollection = [];

          const created = await createBets.save();
          console.log(created);
          await stats.updateStats(id);
          console.log(createBets)
        }
      }
    }
  }
}

router.post("/api/place-bets-form", async (req, res) => {
  let bets = req.body;
  let size = bets.betContents.length;
  let betType = "";
  let betCollection = [];

  let totalBetOdds = 1;
  let betResult = "Win";

  if (size > 1) {
    betType = "Parlay";
  } else if (size == 1) {
    betType = bets.betContents[0].type;
  }

  for (let i = 0; i < size; i++) {
    let individaulBet = bets.betContents[i];
    if(individaulBet.result == "Loss"){
      betResult = "Loss"
    }
    totalBetOdds=totalBetOdds*individaulBet.odds;

    let betDetails = {
      type: individaulBet.type,
      sport: individaulBet.sport,
      date: individaulBet.date.substring(2, individaulBet.date.length),
      selection: individaulBet.selection,
      odds: individaulBet.odds,
      result: individaulBet.result,
      homeTeam: individaulBet.home,
      awayTeam: individaulBet.away,
      homeSpread :"",
      awaySpread: ""

    };

    if (individaulBet.type == "Spread") {
      betDetails.homeSpread = individaulBet.homeSpread;
      betDetails.awaySpread = individaulBet.awaySpread;
    }
    betCollection.push(betDetails);
  }

  let createBets = new Bets({
    userId: bets.id,
    size: size,
    totalOdds: totalBetOdds,
    stake: bets.stake,
    result: betResult,
    payout: bets.payout,
    sportsbook: bets.sportsbook,
    type: betType,
    betContents: betCollection,
  });

  const created = await createBets.save();
  console.log(created);
  await stats.updateStats(bets.id);
  return res.status(200).json({ success: true });
});

router.get("/api/stake-threshold", async (req, res) => {
 let id = req.query.id;
  const bets = await Bets.find({userId: id});

  let betStakes = [];
  let betTotal = 0;
  let stakeThreshold = 0
  const betsnum = bets.length;

  for (i = 0; i < betsnum; i++) {
    betStakes.push(bets[i].stake);
    betTotal += bets[i].stake;
  }

  let stakeAverage = betTotal/betsnum

  const sd = math.std(betStakes)

  // Calculate 3 standard deviations above the mean to find threshold
  if(betsnum == 0) {
    stakeThreshold = 0
  } else {
    stakeThreshold = stakeAverage + (3*sd)
  } 

  return res.status(200).json({ stakeThreshold });
});

router.get("/api/bet-frequency", async (req, res) => {
  let id = req.query.id;

  const currentDate = Date.now();
  var currentTimestamp = new Date(currentDate).toISOString();

  var today = new Date();
  var last1h = new Date(today.getTime() - (1000*60*60));

  const bets = await Bets.find(
    {
      userId: id,
      timestamp: {
        $gte: last1h,
        $lte: currentTimestamp,
      }
    }
    );

    let betCountLast1h = bets.length


  return res.status(200).json({ betCountLast1h });
});

router.get("/api/bet-habits", async (req, res) => {
  let id = req.query.id;
  const bets = await Bets.find(
    {
      userId: id
    }
  )
  
  let betHabits = [];
  let teams = [];
  //let results = [];

  for(const bet of bets) {
    let result = bet.result
    let team = bet.betContents[0].selection
    let betResult = {team: team, result: result};
    betHabits.push(betResult)
    teams.push(team)
  }
  const mostFreqTeam = mode(teams);

  let habits = []
  let freqTeamLossCount = 0;
  let freqTeamWinCount = 0;

  for(const bet of betHabits) {
    if(bet.team == mostFreqTeam) {
      habits.push(bet)
      if(bet.result == "Win") {
        freqTeamWinCount++;
      } else if (bet.result == "Loss") {
        freqTeamLossCount++;
      }
    }
  }

  return res.status(200).json({favouredTeam: mostFreqTeam, lossCount: freqTeamLossCount, winCount: freqTeamWinCount,habits: habits});
});

function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

module.exports = router;

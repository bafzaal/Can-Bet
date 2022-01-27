const Users = require("../models/userSchema");
const Bets = require("../models/betsSchema");

async function updateStats(id)
{
    Bets.find({ userId: id }, async function(err, bets) 
    {
        const user = await Users.findById(id).exec();

        if(bets.length > 0)
        {
            const overall = getSpecifics(bets);
            await setSpecifics(overall, user, ['overall', 'all']);
        }
        
        const moneylineBets = await Bets.find({ type: 'Moneyline', userId : id });
        if(moneylineBets.length > 0)
        {
            const moneylineStats = getSpecifics(moneylineBets);
            await setSpecifics(moneylineStats, user, ['betTypes', 'moneyline']);
        }

        const spreadBets = await Bets.find({ type: 'Spread', userId : id });
        if(spreadBets.length > 0)
        {
            const spreadStats = getSpecifics(spreadBets);
            await setSpecifics(spreadStats, user, ['betTypes', 'spread']);
        }

        const parlayBets = await Bets.find({ type: 'Parlay', userId : id });
        if(parlayBets.length > 0)
        {
            const parlayStats = getSpecifics(parlayBets);
            await setSpecifics(parlayStats, user, ['betTypes', 'parlay']);
        }

        const NFLBets = await Bets.find({ size: 1, userId: id, 'betContents.sport': 'NFL' });
        if(NFLBets.length > 0)
        {
            const NFLStats = getSpecifics(NFLBets);
            await setSpecifics(NFLStats, user, ['sports', 'NFL']);
        }

        const NBABets = await Bets.find({ size: 1, userId: id, 'betContents.sport': 'NBA' });
        if(NBABets.length > 0)
        {
            const NBAStats = getSpecifics(NBABets);
            await setSpecifics(NBAStats, user, ['sports', 'NBA']);
        }
        
        const NHLBets = await Bets.find({ size: 1, userId: id, 'betContents.sport': 'NHL' });
        if(NHLBets.length > 0)
        {
            const NHLStats = getSpecifics(NHLBets);
            await setSpecifics(NHLStats, user, ['sports', 'NHL']);
        }
    });
}

function getSpecifics(bets)
{
    let wins = 0;
    let losses = 0;
    let pushes = 0;
    let pending = 0;
    let sumOdds = 0;
    let amountBet = 0;
    let profitLoss = 0;
    let ROI = 0;
    bets.forEach(function(bet) 
    {
        profitLoss += (parseFloat(bet.payout))-bet.stake;
        sumOdds += bet.totalOdds;   
        amountBet += bet.stake;
        if(bet.result == 'Win') wins++;
        else if(bet.result == 'Loss') losses++;
        else if(bet.result == 'Push') pushes++;
        else if(bet.result == 'Pending') pending++;
    });
    profitLoss = profitLoss - amountBet;
    ROI = (profitLoss / amountBet) * 100;
    ROI = ROI.toFixed(0).toString(  ) + '%';
    if(profitLoss >= 0)
        profitLoss = '+ $' + profitLoss.toFixed(2).toString();
    else
    {
        profitLoss *= -1;
        profitLoss = '- $' + profitLoss.toFixed(2).toString();
    }
    return [wins, losses, pushes, pending, sumOdds, amountBet, profitLoss, ROI];
}

async function setSpecifics(stats, user, placement)
{
    user['stats'][placement[0]][placement[1]] = 
    {
        winCount: stats[0],
        lossCount: stats[1],
        pushCount: stats[2],
        pendingCount: stats[3],
        totalBets: stats[0] + stats[1] + stats[2] + stats[3],
        averageOdds: stats[4] / (stats[0] + stats[1] + stats[2] + stats[3]),
        amountBet: stats[5],
        profitLoss: stats[6],
        ROI: stats[7]
    }; 
    await user.save();
}

module.exports = { updateStats: updateStats }

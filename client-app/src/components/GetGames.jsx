import React, { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import PropTypes, { func } from 'prop-types';
import NFL from '../images/NFL.png'
import UNIBET from '../images/UNIBET.jpeg'
import BarstoolSportsbook from '../images/Barstool-Sportsbook.png'
import DraftKings from '../images/DraftKings.jpeg'
import FanDuel from '../images/FanDuel.jpeg'
import FoxBet from '../images/FoxBet.jpeg'
import * as ReactBootStrap from 'react-bootstrap';

GetGames.propTypes = {
    games: PropTypes.array,
};
GetGames.defaultProps = {
    games: [],
};

var currentDate = new Date()
var currentDateTime

function GetAmericanOdds(odds) {
    const americanOdds = []
    if (odds[0] >= 2)
        americanOdds.push('+' + Math.round((odds[0] - 1) * 100))
    else if (odds[0] < 2)
        americanOdds.push(Math.round(-100 / (odds[0] - 1)))

    if (odds[1] >= 2)
        americanOdds.push('+' + Math.round((odds[1] - 1) * 100))
    else if (odds[1] < 2)
        americanOdds.push(Math.round(-100 / (odds[1] - 1)))

    return americanOdds
}

function GetGames(props) {
    const { games } = props

    const [loading, setLoading] = useState(false);
    var bestOdds = [];

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }, [])

    const mapGames = [] // [{game name, unitbet, ...}] game name, game time, map to values
    games.forEach(function (item) {
        var unibet = []
        var barstool = []
        var draftkings = []
        var fanduel = []
        var foxbet = []
        item.sites.forEach(function (site) {
            if (site.site_key == "unibet") {
                unibet.push(site.odds.h2h[0])
                unibet.push(site.odds.h2h[1])
                unibet.push(GetAmericanOdds(site.odds.h2h)[0])
                unibet.push(GetAmericanOdds(site.odds.h2h)[1])
            }
            if (site.site_key == "barstool") {
                barstool.push(site.odds.h2h[0])
                barstool.push(site.odds.h2h[1])
                barstool.push(GetAmericanOdds(site.odds.h2h)[0])
                barstool.push(GetAmericanOdds(site.odds.h2h)[1])
            }
            if (site.site_key == "draftkings") {
                draftkings.push(site.odds.h2h[0])
                draftkings.push(site.odds.h2h[1])
                draftkings.push(GetAmericanOdds(site.odds.h2h)[0])
                draftkings.push(GetAmericanOdds(site.odds.h2h)[1])
            }
            if (site.site_key == "fanduel") {
                fanduel.push(site.odds.h2h[0])
                fanduel.push(site.odds.h2h[1])
                fanduel.push(GetAmericanOdds(site.odds.h2h)[0])
                fanduel.push(GetAmericanOdds(site.odds.h2h)[1])
            }
            if (site.site_key == "foxbet") {
                foxbet.push(site.odds.h2h[0])
                foxbet.push(site.odds.h2h[1])
                foxbet.push(GetAmericanOdds(site.odds.h2h)[0])
                foxbet.push(GetAmericanOdds(site.odds.h2h)[1])
            }

        });
        var gameDate = new Date(item.commence_time * 1000); // according to local time zone
        //localDate.setUTCMinutes(item.commence_time)
        //console.log()
        currentDateTime = "Last Updated: " + currentDate.toLocaleString()
        mapGames.push({ gameNames: item.teams, oddsMap: { unibet: unibet, barstool: barstool, draftkings: draftkings, fanduel: fanduel, foxbet: foxbet }, gameTime: gameDate.toLocaleString() })
    });


    console.log("hi", mapGames)

    Array.from(mapGames).forEach(function(item) {
        var currBestOdds = [[0,0]]
        if(Object.entries(item)[1][1].unibet[0] > currBestOdds[0][0])
            currBestOdds[0][0] = Object.entries(item)[1][1].unibet[0];
        if(Object.entries(item)[1][1].unibet[0] > currBestOdds[0][1])
            currBestOdds[0][1] = Object.entries(item)[1][1].unibet[1];

        if(Object.entries(item)[1][1].barstool[0] > currBestOdds[0][0])
            currBestOdds[0][0] = Object.entries(item)[1][1].barstool[0];
        if(Object.entries(item)[1][1].barstool[0] > currBestOdds[0][1])
            currBestOdds[0][1] = Object.entries(item)[1][1].barstool[1];

        if(Object.entries(item)[1][1].draftkings[0] > currBestOdds[0][0])
            currBestOdds[0][0] = Object.entries(item)[1][1].draftkings[0];
        if(Object.entries(item)[1][1].draftkings[0] > currBestOdds[0][1])
            currBestOdds[0][1] = Object.entries(item)[1][1].draftkings[1];

        if(Object.entries(item)[1][1].fanduel[0] > currBestOdds[0][0])
            currBestOdds[0][0] = Object.entries(item)[1][1].fanduel[0];
        if(Object.entries(item)[1][1].fanduel[0] > currBestOdds[0][1])
            currBestOdds[0][1] = Object.entries(item)[1][1].fanduel[1];

        if(Object.entries(item)[1][1].foxbet[0] > currBestOdds[0][0])
            currBestOdds[0][0] = Object.entries(item)[1][1].foxbet[0];
        if(Object.entries(item)[1][1].foxbet[0] > currBestOdds[0][1])
            currBestOdds[0][1] = Object.entries(item)[1][1].foxbet[1];
        bestOdds.push(currBestOdds)
    })
    console.log(bestOdds)
    return (
        <div>
            {
                loading ?
                    <div className="loading">
                        <ClipLoader color={"#D74C36"} loading={loading} size={100} />
                    </div>
                    :
                    <>
                        <h1 className="text-center headingLine">NFL MONEYLINE ODDS</h1>
                        <ReactBootStrap.Table striped bordered hover responsive className="OddsTable">
                            <thead>
                                <tr>
                                    <td className="text-center NFLLogo"><img width="72" height="100" src={NFL} /></td>
                                    <td width="200" height="80"><img width="160" height="100" src={UNIBET} /></td>
                                    <td width="200" height="80"><img width="160" height="100" src={BarstoolSportsbook} /></td>
                                    <td width="200" height="80"><img width="160" height="100" src={DraftKings} /></td>
                                    <td width="200" height="80"><img width="160" height="100" src={FanDuel} /></td>
                                    <td width="200" height="80"><img width="160" height="100" src={FoxBet} /></td>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    mapGames.map((game, i) => {
                                        return <tr key={game.id}>
                                            <td className="text-center">{game.gameNames[0]} <br />{game.gameNames[1]} <br /><p className="text-danger">{game.gameTime}</p></td>
                                            <td className="text-center"><span className={game.oddsMap.unibet[0] != null && game.oddsMap.unibet[0].toString() === bestOdds[i][0][0].toString() ? 'text-strike' : null}>{game.oddsMap.unibet[0]} / {game.oddsMap.unibet[2]}</span> <br /><span className={game.oddsMap.unibet[1] != null && game.oddsMap.unibet[1].toString() === bestOdds[i][0][1].toString() ? 'text-strike' : null}>{game.oddsMap.unibet[1]} / {game.oddsMap.unibet[3]}</span></td>
                                            <td className="text-center"><span className={game.oddsMap.barstool[0] != null && game.oddsMap.barstool[0].toString() === bestOdds[i][0][0].toString() ? 'text-strike' : null}>{game.oddsMap.barstool[0]} / {game.oddsMap.barstool[2]}</span> <br /><span className={game.oddsMap.barstool[1] != null && game.oddsMap.barstool[1].toString() === bestOdds[i][0][1].toString() ? 'text-strike' : null}>{game.oddsMap.barstool[1]} / {game.oddsMap.barstool[3]}</span></td>
                                            <td className="text-center"><span className={game.oddsMap.draftkings[0] != null && game.oddsMap.draftkings[0].toString() === bestOdds[i][0][0].toString() ? 'text-strike' : null}>{game.oddsMap.draftkings[0]} / {game.oddsMap.draftkings[2]}</span> <br /><span className={game.oddsMap.draftkings[1] != null && game.oddsMap.draftkings[1].toString() === bestOdds[i][0][1].toString() ? 'text-strike' : null}>{game.oddsMap.draftkings[1]} / {game.oddsMap.draftkings[3]}</span></td>
                                            <td className="text-center"><span className={game.oddsMap.fanduel[0] != null && game.oddsMap.fanduel[0].toString() === bestOdds[i][0][0].toString() ? 'text-strike' : null}>{game.oddsMap.fanduel[0]} / {game.oddsMap.fanduel[2]}</span>  <br /><span className={game.oddsMap.fanduel[1] != null && game.oddsMap.fanduel[1].toString() === bestOdds[i][0][1].toString() ? 'text-strike' : null}>{game.oddsMap.fanduel[1]} / {game.oddsMap.fanduel[3]}</span></td>
                                            <td className="text-center"><span className={game.oddsMap.foxbet[0] != null && game.oddsMap.foxbet[0].toString() === bestOdds[i][0][0].toString() ? 'text-strike' : null}>{game.oddsMap.foxbet[0]} / {game.oddsMap.foxbet[2]}</span> <br /><span className={game.oddsMap.foxbet[1] != null && game.oddsMap.foxbet[1].toString() === bestOdds[i][0][1].toString() ? 'text-strike' : null}>{game.oddsMap.foxbet[1]} / {game.oddsMap.foxbet[3]}</span></td>
                                        </tr>
                                    })
                                }

                            </tbody>
                            
                        </ReactBootStrap.Table>
                        <p>{currentDateTime}</p>
                        
                    </>
            }
        </div>

    )
}

export default GetGames;
import React, { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import PropTypes from 'prop-types';
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

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    const mapGames = [] // [{game name, unitbet, ...}] game name, map to values
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
        mapGames.push({ gameNames: item.teams, oddsMap: { unibet: unibet, barstool: barstool, draftkings: draftkings, fanduel: fanduel, foxbet: foxbet } })
    });


    console.log("hi", mapGames)
    return (
        <div>
            {
                loading ?
                    <div className="loading">
                        <ClipLoader color={"#D74C36"} loading={loading} size={100} />
                    </div>
                    :
                    <>
                        <h1 className="text-center heading">NFL MONEYLINE ODDS</h1>
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
                                    mapGames.map(game => {
                                        return <tr key={game.id}>
                                            <td className="text-center">{game.gameNames[0]} <br />{game.gameNames[1]} </td>
                                            <td className="text-center">{game.oddsMap.unibet[0]} / {game.oddsMap.unibet[2]} <br />{game.oddsMap.unibet[1]} / {game.oddsMap.unibet[3]}</td>
                                            <td className="text-center">{game.oddsMap.barstool[0]} / {game.oddsMap.barstool[2]} <br />{game.oddsMap.barstool[1]} / {game.oddsMap.barstool[3]}</td>
                                            <td className="text-center">{game.oddsMap.draftkings[0]} / {game.oddsMap.draftkings[2]} <br />{game.oddsMap.draftkings[1]} / {game.oddsMap.draftkings[3]}</td>
                                            <td className="text-center">{game.oddsMap.fanduel[0]} / {game.oddsMap.fanduel[2]} <br />{game.oddsMap.fanduel[1]} / {game.oddsMap.fanduel[3]}</td>
                                            <td className="text-center">{game.oddsMap.foxbet[0]} / {game.oddsMap.foxbet[2]} <br />{game.oddsMap.foxbet[1]} / {game.oddsMap.foxbet[3]}</td>
                                        </tr>
                                    })
                                }

                            </tbody>
                        </ReactBootStrap.Table>
                    </>
            }
        </div>

    )
}

export default GetGames;
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
import { Form, Card, Button, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import GameCard from './GameCard'

ShowUpcoming.propTypes = {
    games: PropTypes.array,
    selectedDate: PropTypes.instanceOf(Date),
    selectedLeague: PropTypes.string
};
ShowUpcoming.defaultProps = {
    games: [],
    selectedDate: new Date(),
    selectedLeague: "All"
};

var currentDate = new Date()
var currentDateTime

function toggleOdds(game) {
    game.oddsHidden = false;
    console.log(game)
}

function datesAreOnSameDay(first, second) {
    return (first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate())
}

function ShowUpcoming(props) {
    const { games, selectedDate, selectedLeague } = props
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }, [])

    const mapGames = [] // [{game name, unitbet, ...}] game name, game time, map to values
    let i = 0
    games.forEach(function (item) {
        i++;
        var gameDate = new Date(item.commence_time * 1000); // according to local time zone
        //localDate.setUTCMinutes(item.commence_time)
        //console.log()
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const options_time = { hour: "numeric", minute: "2-digit" }
        currentDateTime = "Last Updated: " + currentDate.toLocaleString()
        if (datesAreOnSameDay(gameDate, selectedDate)) {
            mapGames.push({ gameNames: item.teams, league: item.sport_nice, gameTime: gameDate.toLocaleDateString(undefined, options) + " (" + gameDate.toLocaleTimeString(undefined, options_time) + ")", gameItem: item})
        }
    });
    let nhlGames = mapGames.filter((game) => { return game.league == "NHL" })
    let nflGames = mapGames.filter((game) => { return game.league == "NFL" })
    let nbaGames = mapGames.filter((game) => { return game.league == "NBA" })
    let showNHL = selectedLeague == "NHL" || selectedLeague == "All"
    let showNFL = selectedLeague == "NFL" || selectedLeague == "All"
    let showNBA = selectedLeague == "NBA" || selectedLeague == "All"
    let noGamesNHL = nhlGames.length == 0 && showNHL
    let noGamesNFL = nflGames.length == 0 && showNFL
    let noGamesNBA = nbaGames.length == 0 && showNBA

    return (
        <div>
            {
                loading ?
                    <div className="loading">
                        <ClipLoader color={"#D74C36"} loading={loading} size={100} />
                    </div>
                    :
                    <>
                        <Row>
                            {showNFL &&
                                <h5 className="headingLine">NFL</h5>
                            }
                            {noGamesNFL &&
                                <p className="text-center">No NFL Games Today</p>
                            }
                            {showNFL &&
                                nflGames.map((game, i) => {
                                    return <Col xs="6" key={game.id}>
                                        <GameCard teams={game.gameNames} gameTime={game.gameTime} gameItem={game.gameItem}></GameCard>
                                    </Col>
                                })
                            }
                            {showNHL &&
                                <h5 className="pull-left headingLine">NHL</h5>
                            }
                            {noGamesNHL &&
                                <p className="text-center">No NHL Games Today</p>
                            }
                            {showNHL &&
                                nhlGames.map((game, i) => {
                                    return <Col xs="6" key={game.id}>
                                        <GameCard teams={game.gameNames} gameTime={game.gameTime} gameItem={game.gameItem}></GameCard>      
                                    </Col>
                                })
                            }
                            {showNBA &&
                                <h5 className="headingLine">NBA</h5>
                            }
                            {noGamesNBA &&
                                <p className="text-center">No NBA Games Today</p>
                            }
                            {showNBA &&
                                nbaGames.map((game, i) => {
                                    return <Col xs="6" key={game.id}>
                                        <GameCard teams={game.gameNames} gameTime={game.gameTime} gameItem={game.gameItem}></GameCard>
                                    </Col>
                                })
                            }
                        </Row>
                        <p>{currentDateTime}</p>

                    </>
            }
        </div>

    )
}

export default ShowUpcoming;
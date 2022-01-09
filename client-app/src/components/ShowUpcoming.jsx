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

ShowUpcoming.propTypes = {
    games: PropTypes.array,
    selectedDate: PropTypes.instanceOf(Date)
};
ShowUpcoming.defaultProps = {
    games: [],
    selectedDate: new Date()
};

var currentDate = new Date()
var currentDateTime

function datesAreOnSameDay(first, second) {
    return (first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate())
}

function ShowUpcoming(props) {
    const { games, selectedDate } = props
    const [loading, setLoading] = useState(false);
    var bestOdds = [];

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }, [])

    const mapGames = [] // [{game name, unitbet, ...}] game name, game time, map to values
    console.log(games)
    games.forEach(function (item) {
        var gameDate = new Date(item.commence_time * 1000); // according to local time zone
        //localDate.setUTCMinutes(item.commence_time)
        //console.log()
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const options_time = { hour: "numeric", minute: "2-digit" }
        currentDateTime = "Last Updated: " + currentDate.toLocaleString()
        if (datesAreOnSameDay(gameDate, selectedDate)) {
            mapGames.push({ gameNames: item.teams, league: item.sport_nice, gameTime: gameDate.toLocaleDateString(undefined, options) + " (" + gameDate.toLocaleTimeString(undefined, options_time) + ")" })
        }
    });
    console.log(mapGames)
    let nhlGames = mapGames.filter((game) => {return game.league == "NHL"})
    let nflGames = mapGames.filter((game) => {return game.league == "NFL"})
    let nbaGames = mapGames.filter((game) => {return game.league == "NBA"})
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
                        <h5 className="headingLine">NFL</h5>
                        {
                            nflGames.map((game, i) => {
                                return <Col xs="6" key={game.id}>
                                        <Card className="mrgn-btm-3p hover-card">
                                            <Card.Body>
                                                <Row className="mrgn-btm-3p">
                                                    <Col>
                                                        <Card.Text>
                                                            <strong> {game.gameTime} </strong> <br />
                                                            {game.gameNames[1]} at
                                                            <br />
                                                            {game.gameNames[0]}
                                                        </Card.Text>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="8">
                                                        <img height="30px" className="mrgn-rt-5px" src={BarstoolSportsbook}></img>
                                                        <img height="30px" className="mrgn-rt-5px" src={UNIBET}></img>
                                                        <img height="30px" className="mrgn-rt-5px" src={FanDuel}></img>
                                                        <img height="30px" className="mrgn-rt-5px" src={DraftKings}></img>
                                                        <img height="30px" className="mrgn-rt-5px" src={FoxBet}></img>
                                                    </Col>
                                                    <Col xs="4">
                                                        <Button variant="primary" className="pull-right">Odds</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                            })
                        }
                        <h5 className="headingLine">NBA</h5>
                        {
                            nbaGames.map((game, i) => {
                                return <Col xs="6" key={game.id}>
                                        <Card className="mrgn-btm-3p hover-card">
                                            <Card.Body>
                                                <Row className="mrgn-btm-3p">
                                                    <Col>
                                                        <Card.Text>
                                                            <strong> {game.gameTime} </strong> <br />
                                                            {game.gameNames[1]} at
                                                            <br />
                                                            {game.gameNames[0]}
                                                        </Card.Text>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="8">
                                                        <img height="30px" className="mrgn-rt-5px" src={BarstoolSportsbook}></img>
                                                        <img height="30px" className="mrgn-rt-5px" src={UNIBET}></img>
                                                        <img height="30px" className="mrgn-rt-5px" src={FanDuel}></img>
                                                        <img height="30px" className="mrgn-rt-5px" src={DraftKings}></img>
                                                        <img height="30px" className="mrgn-rt-5px" src={FoxBet}></img>
                                                    </Col>
                                                    <Col xs="4">
                                                        <Button variant="primary" className="pull-right">Odds</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                            })
                        }
                        <h5 className="headingLine">NHL</h5>
                        {
                            nhlGames.map((game, i) => {
                                return <Col xs="6" key={game.id}>
                                        <Card className="mrgn-btm-3p hover-card">
                                            <Card.Body>
                                                <Row className="mrgn-btm-3p">
                                                    <Col>
                                                        <Card.Text>
                                                            <strong> {game.gameTime} </strong> <br />
                                                            {game.gameNames[1]} at
                                                            <br />
                                                            {game.gameNames[0]}
                                                        </Card.Text>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="8">
                                                        <img height="30px" className="mrgn-rt-5px" src={BarstoolSportsbook}></img>
                                                        <img height="30px" className="mrgn-rt-5px" src={UNIBET}></img>
                                                        <img height="30px" className="mrgn-rt-5px" src={FanDuel}></img>
                                                        <img height="30px" className="mrgn-rt-5px" src={DraftKings}></img>
                                                        <img height="30px" className="mrgn-rt-5px" src={FoxBet}></img>
                                                    </Col>
                                                    <Col xs="4">
                                                        <Button variant="primary" className="pull-right">Odds</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
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
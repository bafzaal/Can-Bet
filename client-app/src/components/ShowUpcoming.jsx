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
};
ShowUpcoming.defaultProps = {
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

function ShowUpcoming(props) {
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
        const options = { weekday: 'long', month: 'long', day: 'numeric'};
        const options_time = {hour:"numeric", minute:"2-digit"}
        currentDateTime = "Last Updated: " + currentDate.toLocaleString()
        mapGames.push({ gameNames: item.teams, oddsMap: { unibet: unibet, barstool: barstool, draftkings: draftkings, fanduel: fanduel, foxbet: foxbet }, gameTime: gameDate.toLocaleDateString(undefined, options) + " (" + gameDate.toLocaleTimeString(undefined, options_time) + ")" })
    });


    console.log("hi", mapGames)

    Array.from(mapGames).forEach(function (item) {
        var currBestOdds = [[0, 0]]
        if (Object.entries(item)[1][1].unibet[0] > currBestOdds[0][0])
            currBestOdds[0][0] = Object.entries(item)[1][1].unibet[0];
        if (Object.entries(item)[1][1].unibet[0] > currBestOdds[0][1])
            currBestOdds[0][1] = Object.entries(item)[1][1].unibet[1];

        if (Object.entries(item)[1][1].barstool[0] > currBestOdds[0][0])
            currBestOdds[0][0] = Object.entries(item)[1][1].barstool[0];
        if (Object.entries(item)[1][1].barstool[0] > currBestOdds[0][1])
            currBestOdds[0][1] = Object.entries(item)[1][1].barstool[1];

        if (Object.entries(item)[1][1].draftkings[0] > currBestOdds[0][0])
            currBestOdds[0][0] = Object.entries(item)[1][1].draftkings[0];
        if (Object.entries(item)[1][1].draftkings[0] > currBestOdds[0][1])
            currBestOdds[0][1] = Object.entries(item)[1][1].draftkings[1];

        if (Object.entries(item)[1][1].fanduel[0] > currBestOdds[0][0])
            currBestOdds[0][0] = Object.entries(item)[1][1].fanduel[0];
        if (Object.entries(item)[1][1].fanduel[0] > currBestOdds[0][1])
            currBestOdds[0][1] = Object.entries(item)[1][1].fanduel[1];

        if (Object.entries(item)[1][1].foxbet[0] > currBestOdds[0][0])
            currBestOdds[0][0] = Object.entries(item)[1][1].foxbet[0];
        if (Object.entries(item)[1][1].foxbet[0] > currBestOdds[0][1])
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
                        <Row>
                            {
                                mapGames.map((game, i) => {
                                    return <Col xs="6">
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
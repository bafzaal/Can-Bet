import React, { useEffect, useState, useRef } from "react";
import PropTypes, { func } from 'prop-types';
import "react-datepicker/dist/react-datepicker.css";
import { Row, Card, Col, Button } from "react-bootstrap";
import * as ReactBootStrap from 'react-bootstrap';

import PROLINE from "../images/Proline-Plus.png"
import BODOG from "../images/Bodog.png"
import BET99 from "../images/Bet99.png"
import OddsTable from './OddsTable'

GameCard.propTypes = {
    game: PropTypes.shape({}),
    odds: PropTypes.array,
    loggedIn: PropTypes.bool,
    userId: PropTypes.string
};
GameCard.defaultProps = {
    game: {},
    odds: [],
    loggedIn: false,
    userId: ""
};

function GameCard(props) {

    const [oddsHidden, setOddsHidden] = useState(true);
    const { game, odds, loggedIn, userId } = props

    function toggleOddsHidden(e) {
        setOddsHidden(!oddsHidden);
    }

    const options = { weekday: 'long', month: 'long', day: 'numeric' }
    const options_time = { hour: "numeric", minute: "2-digit" }
    let gameDate = new Date(game.time)
    // Values for if game is pre-game
    let gameTime = gameDate.toLocaleDateString(undefined, options) + " (" + gameDate.toLocaleTimeString(undefined, options_time) + ")"
    let hideOddsDiv = false
    let clock = ""
    if (game.game_over) {
        // if game is over
        hideOddsDiv = true
        gameTime = "Final"
    } else if (game.status == "in") {
        // if game is in-progress
        hideOddsDiv = true
        gameTime = "In-Progress"
        clock = game.time_summary
    }

    let home_won = false;
    if (game.home_score && game.home_score > game.away_score) home_won = true
    return (
        <>
            <Card className="mrgn-btm-3p hover-card">
                <Card.Body>
                    <Row className="mrgn-btm-3p">
                        <ReactBootStrap.Table borderless={true}>
                            <tbody>
                                <tr>
                                    <td><a href={game.espn_link} target="_blank" className="dark-link"> {gameTime} </a></td>
                                    <td>{clock}</td>
                                </tr>
                                <tr>
                                    <td><img height="24px" className="mrgn-rt-5px" src={game.home_logo}></img><i className={game.home_rank ? null : "hidden"}>#{game.home_rank} </i>{game.home_team} <strong>(H)</strong></td>
                                    <td className={home_won && game.game_over ? "dark-link" : ""}>{game.home_score}</td>
                                </tr>
                                <tr>
                                    <td><img height="24px" className="mrgn-rt-5px" src={game.away_logo}></img><i className={game.away_rank ? null : "hidden"}>#{game.away_rank} </i>{game.away_team} <strong>(A)</strong></td>
                                    <td className={!home_won && game.game_over ? "dark-link" : ""}>{game.away_score}</td>
                                </tr>
                            </tbody>
                        </ReactBootStrap.Table>
                    </Row>
                    {!hideOddsDiv &&
                        <Row>
                            <Col xs="8">
                                {odds.filter((x) => { return x.book == "Proline+" }).length > 0 &&
                                    <img height="20px" className="mrgn-rt-5px" src={PROLINE}></img>
                                }
                                {odds.filter((x) => { return x.book == "bodog" }).length > 0 &&
                                    <img height="20px" className="mrgn-rt-5px" src={BODOG}></img>
                                }
                                {odds.filter((x) => { return x.book == "Bet99" }).length > 0 &&
                                    <img height="20px" className="mrgn-rt-5px" src={BET99}></img>
                                }
                            </Col>
                            <Col xs="4">
                                {odds.length > 0 &&
                                    <Button variant="primary" className="pull-right" onClick={toggleOddsHidden}>Odds</Button>
                                }
                            </Col>
                        </Row>
                    }
                    <Row>
                        {
                            !oddsHidden &&
                            <div>
                                <br />
                                <hr />
                                <OddsTable game={game} odds={odds} loggedIn={loggedIn} userId={userId}></OddsTable>
                            </div>
                        }
                    </Row>
                </Card.Body>
            </Card>
        </>
    );
}

export default GameCard;
import React, { useEffect, useState, useRef } from "react";
import PropTypes, { func } from 'prop-types';
import "react-datepicker/dist/react-datepicker.css";
import { Row, Card, Col, Button } from "react-bootstrap";

import PROLINE from "../images/Proline-Plus.png"
import BODOG from "../images/Bodog.png"
import BET99 from "../images/Bet99.png"
import OddsTable from './OddsTable'

GameCard.propTypes = {
    game: PropTypes.shape({}),
    odds: PropTypes.array
};
GameCard.defaultProps = {
    game: {},
    odds: []
};

function GameCard(props) {

    const [oddsHidden, setOddsHidden] = useState(true);
    const { game, odds } = props

    function toggleOddsHidden(e) {
        setOddsHidden(!oddsHidden);
    }

    const options = { weekday: 'long', month: 'long', day: 'numeric' }
    const options_time = { hour: "numeric", minute: "2-digit" }
    let gameDate = new Date(game.time)
    let gameTime = gameDate.toLocaleDateString(undefined, options) + " (" + gameDate.toLocaleTimeString(undefined, options_time) + ")"
    return (
        <>
            <Card className="mrgn-btm-3p hover-card">
                <Card.Body>
                    <Row className="mrgn-btm-3p">
                        <Col>
                            <Card.Text>
                                <a href={game.espn_link} target="_blank" className="dark-link"> {gameTime} <br /> </a>
                                <img height="24px" className="mrgn-rt-5px" src={game.home_logo}></img><i className={game.home_rank ? null : "hidden"}>#{game.home_rank} </i>{game.home_team} <strong>(H)</strong>
                                <br />
                                <img height="24px" className="mrgn-rt-5px" src={game.away_logo}></img><i className={game.away_rank ? null : "hidden"}>#{game.away_rank} </i>{game.away_team} <strong>(A)</strong>
                            </Card.Text>
                        </Col>
                    </Row>
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
                    <Row>
                        {
                            !oddsHidden &&
                            <div>
                                <br />
                                <hr />
                                <OddsTable game={game} odds={odds}></OddsTable>
                            </div>
                        }
                    </Row>
                </Card.Body>
            </Card>
        </>
    );
}

export default GameCard;
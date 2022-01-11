import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import { Row, Card, Col, Button } from "react-bootstrap";
import UNIBET from '../images/UNIBET.jpeg'
import BarstoolSportsbook from '../images/Barstool-Sportsbook.png'
import DraftKings from '../images/DraftKings.jpeg'
import FanDuel from '../images/FanDuel.jpeg'
import FoxBet from '../images/FoxBet.jpeg'
import GetGames from './GetGames'
import PropTypes, { func } from 'prop-types';

GameCard.propTypes = {
    teams: PropTypes.array,
    gameTime: PropTypes.string,
    gameItem: Object
};
GameCard.defaultProps = {
    teams: [],
    gameTime: "",
    gameItem: null
};

function GameCard(props) {

    const [oddsHidden, setOddsHidden] = useState(true);
    const { teams, gameTime, gameItem } = props

    function toggleOddsHidden(e) {
        setOddsHidden(!oddsHidden);
    }

    return (
        <>
            <Card className="mrgn-btm-3p hover-card">
                <Card.Body>
                    <Row className="mrgn-btm-3p">
                        <Col>
                            <Card.Text>
                                <strong> {gameTime} </strong> <br />
                                {teams[0]} <strong>(H)</strong>
                                <br />
                                {teams[1]} <strong>(A)</strong>
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
                            <Button variant="primary" className="pull-right" onClick={toggleOddsHidden}>Odds</Button>
                        </Col>
                    </Row>
                    <Row>
                        {
                            !oddsHidden &&
                            <div>
                                <br />
                                <hr />
                                <GetGames games={[gameItem]}></GetGames>
                            </div>
                        }
                    </Row>
                </Card.Body>
            </Card>
        </>
    );
}

export default GameCard;
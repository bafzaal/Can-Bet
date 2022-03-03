import React, { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import PropTypes, { func } from 'prop-types';
import GameCard from './GameCard'
import { Row, Form, Container, Col, Button } from "react-bootstrap";

ShowUpcoming.propTypes = {
    games: PropTypes.array,
    odds: PropTypes.array
};
ShowUpcoming.defaultProps = {
    games: [],
    odds: []
};

let currentDateTime = new Date().toLocaleString()

function ShowUpcoming(props) {
    const { games, odds } = props
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }, [])

    let game_maps = games.map((game) => {
        let game_odds = odds.filter((x) => {
            return x.league == game.league && x.home_team == game.home_team && x.away_team == game.away_team && x.day_string == game.day_string
        })
        game.odds = game_odds
        return game
    })
    let nhl_games = game_maps.filter((x) => { return x.league == "nhl" })
    let nba_games = game_maps.filter((x) => { return x.league == "nba" })
    let ncaam_games = game_maps.filter((x) => { return x.league == "ncaam" })

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
                            {nhl_games.length > 0 &&
                                <h5 className="pull-left headingLine">NHL</h5>
                            }
                            {nhl_games.length > 0 &&
                                nhl_games.map((game, i) => {
                                    return <Col xs="6" key={game.espnId}>
                                        <GameCard game={game} odds={game.odds}></GameCard>
                                    </Col>
                                })
                            }
                            {nba_games.length > 0 &&
                                <h5 className="headingLine">NBA</h5>
                            }
                            {nba_games.length > 0 &&
                                nba_games.map((game, i) => {
                                    return <Col xs="6" key={game.espnId}>
                                        <GameCard game={game} odds={game.odds}></GameCard>
                                    </Col>
                                })
                            }
                            {ncaam_games.length > 0 &&
                                <h5 className="headingLine">NCAAM</h5>
                            }
                            {ncaam_games.length > 0 &&
                                ncaam_games.map((game, i) => {
                                    return <Col xs="6" key={game.espnId}>
                                        <GameCard game={game} odds={game.odds}></GameCard>
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
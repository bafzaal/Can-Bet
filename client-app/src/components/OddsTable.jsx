import React, { useEffect, useState } from 'react';
import PropTypes, { func } from 'prop-types';
import * as ReactBootStrap from 'react-bootstrap';

import PROLINE from "../images/Proline-Plus.png"
import BODOG from "../images/Bodog.png"
import BET99 from "../images/Bet99.png"

OddsTable.propTypes = {
    game: PropTypes.shape({}),
    odds: PropTypes.array
};
OddsTable.defaultProps = {
    game: {},
    odds: []
};

function getAmericanOdds(price) {
    let americanOdds = 0;
    let price_r = Math.round(price * 100) / 100
    if (price_r >= 2) {
        americanOdds = '+' + Math.round((price_r - 1) * 100)
    } else {
        americanOdds = Math.round(-100 / (price_r - 1))
    }
    return americanOdds
}

function getBestOdds(game, oddsList) {
    let home_entries = oddsList.filter((x) => { return game.home_team == x.team }).sort(function (a, b) {
        return b.price - a.price;
    })
    let away_entries = oddsList.filter((x) => { return game.away_team == x.team }).sort(function (a, b) {
        return b.price - a.price;
    })
    let home_base = home_entries[0].price
    home_entries.forEach((entry) => {
        if (entry.price == home_base) entry.best_odds = true
    })
    let away_base = away_entries[0].price
    away_entries.forEach((entry) => {
        if (entry.price == away_base) entry.best_odds = true
    })
    return [home_entries, away_entries].flat()
}

function OddsTable(props) {
    const { game, odds } = props

    let tableEntries = odds.map((item) => {
        return {
            book: item.book,
            team: item.team,
            price: Math.round(item.price * 100) / 100,
            best_odds: false,
            american: getAmericanOdds(item.price)
        }
    })

    tableEntries = getBestOdds(game, tableEntries)
    let tableObject = {
        proline_home: tableEntries.filter((x) => { return x.book == "Proline+" && x.team == game.home_team })[0],
        bodog_home: tableEntries.filter((x) => { return x.book == "bodog" && x.team == game.home_team })[0],
        bet99_home: tableEntries.filter((x) => { return x.book == "Bet99" && x.team == game.home_team })[0],
        proline_away: tableEntries.filter((x) => { return x.book == "Proline+" && x.team == game.away_team })[0],
        bodog_away: tableEntries.filter((x) => { return x.book == "bodog" && x.team == game.away_team })[0],
        bet99_away: tableEntries.filter((x) => { return x.book == "Bet99" && x.team == game.away_team })[0]
    }

    return (
        <div>
            {
                <>
                    <br />
                    <ReactBootStrap.Table striped bordered hover responsive className="OddsTable">
                        <thead>
                            <tr>
                                <td></td>
                                {tableObject.proline_home &&
                                    <td className="text-center"><img height="20" src={PROLINE}></img></td>
                                }
                                {tableObject.bodog_home &&
                                    <td className="text-center"><img height="20" src={BODOG}></img></td>
                                }
                                {tableObject.bet99_home &&
                                    <td className="text-center"><img height="20" src={BET99}></img></td>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="text-center">{game.home_team_abbr}</td>
                                {tableObject.proline_home &&
                                    <td className="text-center"><span className={tableObject.proline_home.best_odds ? "best-odds" : null}>{tableObject.proline_home.price} / {tableObject.proline_home.american}</span></td>
                                }
                                {tableObject.bodog_home &&
                                    <td className="text-center"><span className={tableObject.bodog_home.best_odds ? "best-odds" : null}>{tableObject.bodog_home.price} / {tableObject.bodog_home.american}</span></td>
                                }
                                {tableObject.bet99_home &&
                                    <td className="text-center"><span className={tableObject.bet99_home.best_odds ? "best-odds" : null}>{tableObject.bet99_home.price} / {tableObject.bet99_home.american}</span></td>
                                }
                            </tr>
                            <tr>
                                <td className="text-center">{game.away_team_abbr}</td>
                                {tableObject.proline_away &&
                                    <td className="text-center"><span className={tableObject.proline_away.best_odds ? "best-odds" : null}>{tableObject.proline_away.price} / {tableObject.proline_away.american}</span></td>
                                }
                                {tableObject.bodog_away &&
                                    <td className="text-center"><span className={tableObject.bodog_away.best_odds ? "best-odds" : null}>{tableObject.bodog_away.price} / {tableObject.bodog_away.american}</span></td>
                                }
                                {tableObject.bet99_away &&
                                    <td className="text-center"><span className={tableObject.bet99_away.best_odds ? "best-odds" : null}>{tableObject.bet99_away.price} / {tableObject.bet99_away.american}</span></td>
                                }
                            </tr>
                        </tbody>

                    </ReactBootStrap.Table>

                </>
            }
        </div>

    )
}

export default OddsTable;
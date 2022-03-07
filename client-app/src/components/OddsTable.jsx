import React, { useEffect, useState, useRef } from 'react';
import PropTypes, { func } from 'prop-types';
import * as ReactBootStrap from 'react-bootstrap';
import axios from 'axios';

import PROLINE from "../images/Proline-Plus.png"
import BODOG from "../images/Bodog.png"
import BET99 from "../images/Bet99.png"

OddsTable.propTypes = {
    game: PropTypes.shape({}),
    odds: PropTypes.array,
    loggedIn: PropTypes.bool,
    userId: PropTypes.string
};
OddsTable.defaultProps = {
    game: {},
    odds: [],
    loggedIn: false,
    userId: ""
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
    const { game, odds, loggedIn, userId } = props
    const [openModal, setOpenModal] = useState(false)
    const [selectedBook, setSelectedBook] = useState("")
    const [selectedBookImage, setSelectedBookImage] = useState("")
    const [selectedBetTitle, setSelectedBetTitle] = useState("")
    const [selectedPick, setSelectedPick] = useState({})
    const [winValue, setWinValue] = useState(0)
    const [returnValue, setReturnValue] = useState(0)
    const [successBanner, setSuccessBanner] = useState(false)
    const [failBanner, setFailBanner] = useState(false)
    const stake = useRef()

    function selectBet(book, game, pick) {
        const bookImages = {
            "Proline+": PROLINE,
            "bodog": BODOG,
            "Bet99": BET99
        }
        setOpenModal(true)
        setSelectedBook(book)
        setSelectedBookImage(bookImages[book])
        let title = `${game.home_team} @ ${game.away_team}`
        setSelectedBetTitle(title)
        let team_abbr = game.home_team == pick.team ? game.home_team_abbr : game.away_team_abbr
        pick.team_abbr = team_abbr
        setSelectedPick(pick)
    }

    function stakeChange() {
        let retVal = stake.current.value * selectedPick.price
        setReturnValue(retVal.toFixed(2))
        setWinValue((retVal - stake.current.value).toFixed(2))
    }

    function submitBet(game) {
        let gameDate = new Date(game.time)
        let date = `${gameDate.toLocaleDateString(undefined, { year: "numeric" })}-` +
            `${gameDate.toLocaleDateString(undefined, { month: "2-digit" })}-` +
            `${gameDate.toLocaleDateString(undefined, { day: "2-digit" })}`
        let betContents = {
            type: "Moneyline",
            sport: game.league.toUpperCase(),
            date: date,
            selection: selectedPick.team,
            odds: selectedPick.price,
            result: "Pending",
            home: game.home_team,
            away: game.away_team
        }
        let betObj = {
            id: userId,
            size: 1,
            totalOdds: selectedPick.price,
            stake: parseFloat(stake.current.value),
            result: "Pending",
            payout: returnValue,
            sportsbook: selectedBook,
            type: "Moneyline",
            betContents: [betContents]
        }
        let url = "http://localhost:3001/api/place-bets-form";
        axios
            .post(url, betObj, {})
            .then((response) => {
                setOpenModal(false)
                setReturnValue(0)
                setWinValue(0)
                setTimeout(() => {
                    setSuccessBanner(true)
                }, 1000)
                setTimeout(() => {
                    setSuccessBanner(false);
                }, 2000);
            })
            .catch((error) => {
                console.log(error);
                setReturnValue(0)
                setWinValue(0)
                setFailBanner(true)
                setTimeout(() => {
                    setFailBanner(false)
                }, 2000)
            });
    }

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
                    {successBanner &&
                        <div class="alert alert-success" role="alert">Successfully placed bet!</div>
                    }
                    {failBanner &&
                        <div class="alert alert-warning" role="alert">An error occured while submitting your bet</div>
                    }
                    {!openModal &&
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
                                        <td className="text-center">
                                            <span className={tableObject.proline_home.best_odds ? "best-odds mrgn-rt-5px" : "mrgn-rt-5px"}>{tableObject.proline_home.price} / {tableObject.proline_home.american}</span>
                                            {loggedIn &&
                                                <span title="Bet" className="fa fa-bookmark" onClick={() => selectBet("Proline+", game, tableObject.proline_home)}></span>
                                            }
                                        </td>
                                    }
                                    {tableObject.bodog_home &&
                                        <td className="text-center">
                                            <span className={tableObject.bodog_home.best_odds ? "best-odds mrgn-rt-5px" : "mrgn-rt-5px"}>{tableObject.bodog_home.price} / {tableObject.bodog_home.american}</span>
                                            {loggedIn &&
                                                <span className="fa fa-bookmark" onClick={() => selectBet("bodog", game, tableObject.bodog_home)}></span>
                                            }
                                        </td>
                                    }
                                    {tableObject.bet99_home &&
                                        <td className="text-center">
                                            <span className={tableObject.bet99_home.best_odds ? "best-odds mrgn-rt-5px" : "mrgn-rt-5px"}>{tableObject.bet99_home.price} / {tableObject.bet99_home.american}</span>
                                            {loggedIn &&
                                                <span className="fa fa-bookmark" onClick={() => selectBet("Bet99", game, tableObject.bet99_home)}></span>
                                            }
                                        </td>
                                    }
                                </tr>
                                <tr>
                                    <td className="text-center">{game.away_team_abbr}</td>
                                    {tableObject.proline_away &&
                                        <td className="text-center">
                                            <span className={tableObject.proline_away.best_odds ? "best-odds mrgn-rt-5px" : "mrgn-rt-5px"}>{tableObject.proline_away.price} / {tableObject.proline_away.american}</span>
                                            {loggedIn &&

                                                <span className="fa fa-bookmark" onClick={() => selectBet("Proline+", game, tableObject.proline_away)}></span>
                                            }
                                        </td>
                                    }
                                    {tableObject.bodog_away &&
                                        <td className="text-center">
                                            <span className={tableObject.bodog_away.best_odds ? "best-odds mrgn-rt-5px" : "mrgn-rt-5px"}>{tableObject.bodog_away.price} / {tableObject.bodog_away.american}</span>
                                            {loggedIn &&
                                                <span className="fa fa-bookmark" onClick={() => selectBet("bodog", game, tableObject.bodog_away)}></span>
                                            }
                                        </td>
                                    }
                                    {tableObject.bet99_away &&
                                        <td className="text-center">
                                            <span className={tableObject.bet99_away.best_odds ? "best-odds mrgn-rt-5px" : "mrgn-rt-5px"}>{tableObject.bet99_away.price} / {tableObject.bet99_away.american}</span>
                                            {loggedIn &&
                                                <span className="fa fa-bookmark" onClick={() => selectBet("Bet99", game, tableObject.bet99_away)}></span>
                                            }
                                        </td>
                                    }
                                </tr>
                            </tbody>
                        </ReactBootStrap.Table>

                    }
                    {openModal &&

                        <div className="modalContainer">
                            <div>
                                <button onClick={() => setOpenModal(false)} className="btn-close pull-right"></button>
                                <img height="20" src={selectedBookImage}></img>  <span className="dark-link">{selectedBetTitle}</span>
                            </div>
                            <div className="mb-3">
                                {selectedPick.team_abbr} {selectedPick.american}<br />
                                <input type="number" className="width-7em" ref={stake} onChange={() => { stakeChange() }}></input><span className='dark-link'> Return</span> ${returnValue}<span className="dark-link"> Win</span> ${winValue}
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-primary" onClick={() => submitBet(game)}>Submit</button>
                            </div>
                        </div>

                    }
                </>
            }
        </div>

    )
}

export default OddsTable;
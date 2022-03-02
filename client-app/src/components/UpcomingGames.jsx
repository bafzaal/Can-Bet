import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import { Row, Form, Container, Col, Button } from "react-bootstrap";
import ShowUpcoming from "./ShowUpcoming"

const UpcomingGames = () => {
    const chosenDate = useRef()
    const chosenLeague = useRef()

    let today = new Date()
    let default_date = new Date().toISOString().split("T")[0]

    const [games, setGames] = useState([])
    const [odds, setOdds] = useState([])

    useEffect(() => {
        CallApi("all", today);
    }, [setGames, setOdds])
    
    function showGames(e) {
        e.preventDefault();
        e.stopPropagation();
        let filterDate = new Date(chosenDate.current.value + " 00:00:00")
        CallApi(chosenLeague.current.value, filterDate)
    }

    function formatNumber(number) {
        return ("0" + number).toString().slice(-2)
    }

    const CallApi = (league, date) => {
        console.log(date)
        let d = date
        let d_string = d.getFullYear().toString() + formatNumber(d.getMonth() + 1) + formatNumber(d.getDate())
        axios.get("http://localhost:3001/api/games", {
            params: {
                league: league,
                date: d_string
            }
        })
        .then((response) => {
            let data = response.data
            setGames(data.games)
            setOdds(data.odds)
            console.log(data)
        })
    }

    return (
        <>
            <Container>
                <Row>
                    <h1 className="text-center headingLine">Upcoming Games</h1>
                </Row>
                <Row className="mrgn-btm-3p">
                    <Col sm={{ span: 6, offset: 3 }}>
                        <Form>
                            <Row>
                                <Col xs={{ span: 5, offset: 1 }}>
                                    <Form.Control ref={chosenDate} type="date" defaultValue={default_date} />
                                </Col>
                                <Col xs="4">
                                    <Form.Select ref={chosenLeague}>
                                        <option value="all">All Leagues</option>
                                        <option value="nhl">NHL</option>
                                        <option value="nba">NBA</option>
                                        {/* <option value="MLB">MLB</option> */}
                                    </Form.Select>
                                </Col>
                                <Col xs="2">
                                    <Button variant="danger" onClick={showGames}>Filter</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <ShowUpcoming games={games} odds={odds}></ShowUpcoming>
            </Container>
        </>
    );
}

export default UpcomingGames;
import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import { Row, Form, Container, Col, Button } from "react-bootstrap";
import ShowUpcoming from "./ShowUpcoming"

const UpcomingGames = () => {
    const chosenDate = useRef()
    const chosenLeague = useRef()

    let today = new Date().toISOString().split("T")[0]

    const [posts, setLines] = useState({ lines: [] });
    // const [games, setGames] = useState({
    //     teams: [],
    //     time: '',
    //     bookmakers: {
    //         name: '',
    //         odds: []
    //     }
    // });
    const [games, setGames] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const apiKey = "dd1b6318c41925cc94e2ff981593aa0e"
    const url = `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?apiKey=${apiKey}&regions=us`

    const api_key = 'dd1b6318c41925cc94e2ff981593aa0e'

    const sport_key = 'americanfootball_nfl' // use the sport_key from the /sports endpoint below, or use 'upcoming' to see the next 8 games across all sports

    const region = 'us' // uk | us | eu | au

    const market = 'h2h' // h2h | spreads | totals

    useEffect(() => {
        getAllLines();
    }, [setLines])
    
    function showGames(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log(chosenDate.current.value)
        let filterDate = new Date(chosenDate.current.value + " 00:00:00")
        console.log(filterDate)
        setSelectedDate(filterDate)
    }

    const getAllLines = () => {
        axios.get('https://api.the-odds-api.com/v3/odds', {
            params: {
                api_key: api_key,
                sport: sport_key,
                region: region,
                mkt: market,
            }
        })
            .then(response => {
                setGames(response.data.data)
                // Check usage
                console.log('Remaining requests', response.headers['x-requests-remaining'])
                console.log('Used requests', response.headers['x-requests-used'])

            })
            .catch(error => {
                console.log('Error status', error.response.status)
                console.log(error.response.data)
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
                                    <Form.Control ref={chosenDate} type="date" defaultValue={today} />
                                </Col>
                                <Col xs="4">
                                    <Form.Select ref={chosenLeague}>
                                        <option value="All">All Leagues</option>
                                        <option value="NFL">NFL</option>
                                        <option value="NHL">NHL</option>
                                        <option value="NBA">NBA</option>
                                        <option value="MLB">MLB</option>
                                    </Form.Select>
                                </Col>
                                <Col xs="2">
                                    <Button variant="danger" onClick={showGames}>Filter</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <ShowUpcoming games={games} selectedDate={selectedDate}></ShowUpcoming>
            </Container>
        </>
    );
}

export default UpcomingGames;
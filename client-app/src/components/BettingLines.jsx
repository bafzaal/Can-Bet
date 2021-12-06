import React, { useEffect, useState } from "react";
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import GetGames from "./GetGames";

const BettingLines = () => {

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

    const apiKey = "77ec35ac8f5f8f738693cead177a6345"
    const url = `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?apiKey=${apiKey}&regions=us`

    const api_key = '77ec35ac8f5f8f738693cead177a6345'

    const sport_key = 'americanfootball_nfl' // use the sport_key from the /sports endpoint below, or use 'upcoming' to see the next 8 games across all sports

    const region = 'us' // uk | us | eu | au

    const market = 'h2h' // h2h | spreads | totals

    useEffect(() => {
        getAllLines();
    }, [setLines])

    const getAllLines = () => {
        // axios.get(`${url}`)
        // .then((response) => {
        //     const allLines = response.data
        //     // console.log('res data is: ', response.data)

        //     const bookKeepers = new Map()


        //     allLines.forEach(function(item) {
        //         item.bookmakers.forEach(function(item2) {
        //             //console.log(item2)
        //             bookKeepers[item2.key] = item2.title
        //         })
        //     });

        //     // console.log(bookKeepers);


        //     // add out data to state
        //     setLines({lines: allLines});
        // })
        // .catch(error => console.error(`Error: ${error}`));

        /*
            Get a list of live & upcoming games for the sport you want, along with odds for different bookmakers
        */
        axios.get('https://api.the-odds-api.com/v3/odds', {
            params: {
                api_key: api_key,
                sport: sport_key,
                region: region,
                mkt: market,
            }
        })
            .then(response => {
                // response.data.data contains a list of live and 
                //   upcoming events and odds for different bookmakers.
                // Events are ordered by start time (live events are first)
                console.log(JSON.stringify(response.data.data))
                // const { property } = response.data.data;
                // setGames((prevState) => ({
                //     ...prevState,
                //     time: response.data.data[0].commence_time,
                //     bookmakers: {
                //         name: esponse.data.data[0].sites.site_nice
                //     }
                // }))

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
        <div>
            {/* <ReactBootStrap.Table striped bordered hover>
                <thead>
                    {
                        posts.lines && posts.lines.map((item) => (
                            <tr key={item.id}>
                                <td>TEAMS</td>
                                <td>{item.bookmakers[0].title}</td>
                                <td>{item.bookmakers[1].title}</td>
                                <td>{item.bookmakers[2].title}</td>
                                <td>{item.bookmakers[3].title}</td>
                                <td>{item.bookmakers[4].title}</td>
                            </tr>
                        ))
                    }
                </thead>
                <tbody>
                   
                </tbody>
            </ReactBootStrap.Table> */}
            <GetGames games={games}></GetGames>
            {/* <NBAGames> */}
            {/* <NBAGames> */}
        </div>
    );
}

export default BettingLines;
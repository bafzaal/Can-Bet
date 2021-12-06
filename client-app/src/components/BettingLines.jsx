import React, {useEffect, useState } from "react";
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';

const BettingLines = () => {
    const [posts, setLines] = useState({lines: new Map});
    const apiKey = ""
    const url = `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?apiKey=${apiKey}&regions=us`
    
    useEffect(() => {
        getAllLines();
    }, [setLines])

    const getAllLines = () => {
        axios.get(`${url}`)
        .then((response) => {
            const allLines = response.data
            console.log(response.data)

            const bookKeepers = new Map()
            

            allLines.forEach(function(item) {
                item.bookmakers.forEach(function(item2) {
                    //console.log(item2)
                    bookKeepers[item2.key] = item2.title
                })
            });

            console.log(bookKeepers);
            

            // add out data to state
            setLines({lines: bookKeepers});
        })
        .catch(error => console.error(`Error: ${error}`));
    }
    

    return (
       <div>
            <ReactBootStrap.Table striped bordered hover>
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
            </ReactBootStrap.Table>
       </div>
    );
}

export default BettingLines;
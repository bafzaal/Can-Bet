import React from 'react';
import PropTypes from 'prop-types';
import * as ReactBootStrap from 'react-bootstrap';

GetGames.propTypes = {
    games: PropTypes.array,
};
GetGames.defaultProps = {
    games: [],
};

function GetGames(props) {
    const {games} = props
    console.log(games)
    return(
        <div>
            <ul className='game-list'>
                {games.map(game => (
                    <li key={game.id}>{game.teams}</li>
                ))}
            </ul>
            <ReactBootStrap.Table>
                <thead>
                    <tr>
                        <td>TEAMS</td>
                        <td>unibet</td>
                        <td>betmgm</td>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>               
                            {
                                games.map(game => (
                                    game.sites.map(book => {
                                        if(book.site_key == "unibet") {
                
                                           return <tr>
                                            <td>{game.teams[0]} <br/> {game.teams[1]} <br/> {game.commence_time}</td>
                                            <td>{book.odds.h2h[0]} <br/> {book.odds.h2h[1]}</td> </tr>
                                        }           
                                    })
                                ))                 
                            }
                </tbody>
            </ReactBootStrap.Table>
        </div>
        
    )
}

export default GetGames;
import React from 'react';
import PropTypes from 'prop-types';

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
        <ul className='game-list'>
            {games.map(game => (
                <li key={game.id}>{game.teams}</li>
            ))}
        </ul>
    )
}

export default GetGames;
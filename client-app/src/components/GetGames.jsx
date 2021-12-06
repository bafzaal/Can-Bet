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

    const mapGames = [] // [{game name, unitbet, ...}] game name, map to values
    games.forEach(function(item) {
        var unibet = []
        var barstool = []
        var draftkings = []
        var fanduel = []
        var foxbet = []
        item.sites.forEach(function(site) {
            if(site.site_key == "unibet") {
                unibet.push(site.odds.h2h[0])
                unibet.push(site.odds.h2h[1])
            }
            if(site.site_key == "barstool") {
                barstool.push(site.odds.h2h[0])
                barstool.push(site.odds.h2h[1]) 
            }
            if(site.site_key == "draftkings") {
                draftkings.push(site.odds.h2h[0])
                draftkings.push(site.odds.h2h[1]) 
            }
            if(site.site_key == "fanduel") {
                fanduel.push(site.odds.h2h[0])
                fanduel.push(site.odds.h2h[1])
            }
            if(site.site_key == "foxbet") {
                foxbet.push(site.odds.h2h[0])
                foxbet.push(site.odds.h2h[1])
            }
            
        });
        mapGames.push({gameNames: item.teams, oddsMap: {unibet: unibet, barstool: barstool, draftkings: draftkings, fanduel: fanduel, foxbet: foxbet}})
    });
    console.log("hi", mapGames)
    return(
        <div>
            {/* <ul className='game-list'>
                {games.map(game => (
                    <li key={game.id}>{game.teams}</li>
                ))}
            </ul> */}
            <ReactBootStrap.Table striped bordered hover>
                <thead>
                    <tr className="danger">
                        <td>Teams</td>
                        <td>Unibet</td>
                        <td>Barstool</td>
                        <td>DraftKings</td>
                        <td>Fanduel</td>
                        <td>FoxBet</td>
                        {/* <td>bookmaker</td>
                        {
                            
                            games.map(game => {
                                return <td>{game.teams}</td>
                            })
                        } */}
                    </tr>
                </thead>
                <tbody> 
                    
                        {
                                mapGames.map(game => {
                                    return <tr>
                                        <td>{game.gameNames[0]} <br />{game.gameNames[1]} </td>
                                        <td>{game.oddsMap.unibet[0]} <br />{game.oddsMap.unibet[1]}</td>
                                        <td>{game.oddsMap.barstool[0]} <br />{game.oddsMap.barstool[1]}</td>
                                        <td>{game.oddsMap.draftkings[0]} <br />{game.oddsMap.draftkings[1]}</td>
                                        <td>{game.oddsMap.fanduel[0]} <br />{game.oddsMap.fanduel[1]}</td>
                                        <td>{game.oddsMap.foxbet[0]} <br />{game.oddsMap.foxbet[1]}</td>
                                    </tr>
                                })                 
                            }
                                         
                </tbody>
            </ReactBootStrap.Table>
        </div>
        
    )
}

export default GetGames;
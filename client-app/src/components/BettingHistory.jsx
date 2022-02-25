import React, { useEffect, useState, useRef } from "react";
import { Row, Form, Container, Col, Button, Select } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const BettingHistory = () => {
  const { id } = useParams();
  const [betHistory, setBetHistory] = useState({});
  const chosenBetHistoryFilter = useRef();
  const [loading, setLoading] = useState(true);

  const [selectedBetHistoryFilter, setSelectedBetHistoryFilter] =
    useState("overall");
  useEffect(() => {
    getBetHistory();
  }, [selectedBetHistoryFilter]);

  const showBetHistory = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedBetHistoryFilter(chosenBetHistoryFilter.current.value);
  };

  const getBetHistory = async () => {
    let url = "http://localhost:3001/api/display-bets";
    await axios
      .get(url, {
        params: {
          id: id,
          filter: selectedBetHistoryFilter,
        },
      })
      .then(function (response) {
      
        if (response.data.success == true) {
          let data = response.data.result;

          setBetHistory(data);
          setLoading(false);
          console.log(betHistory);
          console.log(loading);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Row>
        <h1 className="text-center headingLine">Betting History</h1>
      </Row>

      <Row className="mrgn-btm-3p">
        <Form>
          <Row className="d-flex justify-content-center">
            <Col xs="3">
              <Form.Select ref={chosenBetHistoryFilter}>
                <option value="overall">Overall</option>
                <option value="Moneyline">Moneyline</option>
                <option value="Spread">Spread</option>
                <option value="Parlay">Parlay</option>
                <option value="NFL">NFL</option>
                <option value="NHL">NHL</option>
                <option value="NBA">NBA</option>
              </Form.Select>
            </Col>
            <Col xs="1" className="d-flex justify-content-center">
              <Button variant="danger" onClick={showBetHistory}>
                Filter
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
      <Row>
        {loading ? (
          <div className="loading">
            <ClipLoader color={"#D74C36"} loading={loading} size={100} />
          </div>
        ) : (
          betHistory.map((bet, i) => {
            return (
              <>
                <div className="betHistory col-12" key={i}>
                  <div className="tile">
                    <div className="wrapper">
                      <div className="header">
                        <strong>{bet.type} </strong>

                        {bet.result == "Loss" ? (
                          <i class="text-danger bi bi-x-circle-fill"></i>
                        ) : (
                          <i class="text-success bi bi-check-circle-fill"></i>
                        )}
                      </div>

                      <div className="stats">
                        <div>
                          <strong>SPORTSBOOK</strong> {bet.sportsbook}
                        </div>

                        <div>
                          <strong>ODDS</strong> {bet.totalOdds}
                        </div>

                        <div>
                          <strong>STAKE</strong> {bet.stake}
                        </div>
                        <div>
                          <strong>PAYOUT</strong> {bet.payout}
                        </div>
                      </div>
                      {bet.betContents.map((betDetails, j) => {
                        return (
                          <>
                            <div className="details" key={`${i}-${j}`}>
                              <div className="details-container">
                                <div>
                                  <div className="date">{betDetails.date}</div>
                                  <div className="matchup">
                                    {betDetails.homeTeam} vs.{" "}
                                    {betDetails.awayTeam}
                                  </div>
                                </div>
                                <div className="stats">
                                  <div>
                                    <strong>SPORT</strong> {betDetails.sport}
                                  </div>
                                  <div>
                                    <strong>TYPE</strong> {betDetails.type}
                                  </div>

                                  <div>
                                    <strong>HOME</strong> {betDetails.homeTeam}{" "}
                                    <span style={{ color: "#5aadef" }}>
                                      {betDetails.homeSpread}
                                    </span>
                                  </div>

                                  <div>
                                    <strong>AWAY</strong> {betDetails.awayTeam}{" "}
                                    <span style={{ color: "#5aadef" }}>
                                      {betDetails.awaySpread}
                                    </span>
                                  </div>

                                  <div>
                                    <strong>SELECTION</strong>{" "}
                                    {betDetails.selection}
                                  </div>
                                  <div>
                                    <strong>ODDS</strong> {betDetails.odds}
                                  </div>
                                  <div>
                                    <strong>RESULT</strong> <span>{betDetails.result}   </span>

                                  {betDetails.result == "Loss" ? (
                                    <i class="text-danger bi bi-x-circle-fill"></i>
                                  ) : (
                                    <i class="text-success bi bi-check-circle-fill"></i>
                                  )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            );
          })
        )}
      </Row>
    </>
  );
};

export default BettingHistory;
{
  /* 
<div className="betHistory col-12" key={i}>
              <div className="tile">
                <div className="wrapper">
                  <div className="header">
                    <strong>{bet.type}</strong>
                  </div>

                  <div className="stats">
                    <div>
                      <strong>SPORTSBOOK</strong> {bet.sportsbook}
                    </div>

                    <div>
                      <strong>ODDS</strong> {bet.totalOdds}
                    </div>

                    <div>
                      <strong>STAKE</strong> {bet.stake}
                    </div>
                    <div>
                      <strong>PAYOUT</strong> {bet.payout}
                    </div>
                  </div>
 */
}

{
  /* 
<div className="details">
                    <div className="details-container">
                      <div>
                        <div className="date">12:30 JAN 2015</div>
                        <div className="matchup">Lakers vs. Jazz</div>
                      </div>
                      <div className="stats">
                        <div>
                          <strong>SPORT</strong> 182
                        </div>
                        <div>
                          <strong>TYPE</strong> Moneyline
                        </div>

                        <div>
                          <strong>HOME</strong> 3098
                        </div>

                        <div>
                          <strong>AWAY</strong> 562
                        </div>

                        <div>
                          <strong>SELECTION</strong> 182
                        </div>
                        <div>
                          <strong>ODDS</strong> 182
                        </div>
                        <div>
                          <strong>RESULT</strong> 182
                        </div>
                      </div>
                    </div>
                  </div>
                */
}

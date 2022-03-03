import React, { useEffect, useState, useRef } from "react";
import { Row, Form, Container, Col, Button, Select } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BettingHistory from "./BettingHistory";

const Profile = (props) => {
  const { id } = useParams();
  const chosenBetFilter = useRef();
  const [username, setUsername] = useState("");

  const [selectedBetFilter, setSelectedBetFilter] = useState("overall");

  const [betStats, setBetStats] = useState({});
  
    
  useEffect(() => {
    getUsername();
  });

  const getUsername = async () => {
    let url = "http://localhost:3001/api/username";

    await axios
      .get(url, {
        params: {
          id: id,
        },
      })
      .then(function (response) {
        if (response.data.success == true) {
          let data = response.data.result;

          setUsername(data);

        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getBetStats();
  }, [selectedBetFilter]);

  const showBetStats = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedBetFilter(chosenBetFilter.current.value);
  };

  const getBetStats = async () => {
    let url = "http://localhost:3001/api/display-stats";
    await axios
      .get(url, {
        params: {
          id: id,
          filter: selectedBetFilter,
        },
      })
      .then(function (response) {
        if (response.data.success == true) {
          let data = response.data.result;

          let winRate = (data.winCount / data.totalBets) * 100;
          data.winRate = parseFloat(winRate).toFixed(2);

          let profitLoss = parseFloat(data.profitLoss.split("$")[1]);
          if (data.profitLoss.includes("-")) profitLoss = profitLoss * -1;
          data.profitLoss = profitLoss.toFixed(2);

          let roi = parseFloat(data.ROI.split("%")[0]);
          data.ROI = roi;

          let averageOdds = parseFloat(data.averageOdds).toFixed(2);
          data.averageOdds = averageOdds
  
          setBetStats(data);

        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const performanceNotice = (e) => {
    if(betStats.ROI < 0) {
      return <p className="text-center">NOTICE: we noticed your current ROI is negative with a value of {betStats.ROI}% , please checkout <a href="http://localhost:3000/betting-tips">Betting Tips</a> for some recommendations.</p>
    }
  };

  return (
    <>
      <Container>
        <Row>
          <h1 className="text-center headingLine">Profile</h1>
          <h5 className="text-center">{username}</h5>
        </Row>
        <Row>
          <h5 className="text-center headingLine">Stats</h5>
     
        </Row>
        <Row className="mrgn-btm-3p">
          <Form>
            <Row className="d-flex justify-content-center">
              <Col xs="3">
                <Form.Select ref={chosenBetFilter}>
                  <option value="overall">Overall</option>
                  <option value="moneyline">Moneyline</option>
                  <option value="spread">Spread</option>
                  <option value="parlay">Parlay</option>
                  <option value="NFL">NFL</option>
                  <option value="NHL">NHL</option>
                  <option value="NBA">NBA</option>
                </Form.Select>
              </Col>
              <Col xs="1" className="d-flex justify-content-center">
                <Button variant="danger" onClick={showBetStats}>
                  Filter
                </Button>
              </Col>
            </Row>
          </Form>
        </Row>

        <Row>
          <div className="pb-5 pt-5 pe-0 ps-0">
            <div className="container-fluid">
              <div className="header-body">
                <div className="row d-flex justify-content-center">
                  <div className="col-xl-4 col-lg-10">
                    <div className="card card-stats mb-4 mb-xl-0">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-8">
                            <h5 className="card-title text-uppercase text-muted mb-0">
                              Total Bets
                            </h5>
                            <span className="h2 font-weight-bold mb-0">
                              {betStats.totalBets}
                            </span>
                          </div>
                          <div className="col-4">
                            <div className="icon icon-shape bg-danger h-75 d-flex justify-content-center align-items-center text-white rounded-circle shadow">
                              <i
                                className="fa fa-pie-chart"
                                style={{ fontSize: "1.5rem" }}
                                aria-hidden="true"
                              ></i>
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 text-muted text-sm">
                          {betStats.winRate >= 50 ? (
                            <>
                              <span className="text-success me-2">
                                <i className="fa fa-arrow-up"></i>{" "}
                                {betStats.winRate}%
                              </span>
                            </>
                          ) : (
                            <span className="text-danger me-2">
                              <i className="fa fa-arrow-down"></i>{" "}
                              {betStats.winRate}%
                            </span>
                          )}
                          <span className="text-nowrap">Win Rate</span>
                        </p>
                        <div className="align-items-center d-flex my-1 row">
                          <div className="progress w-75 p-0">
                            <div
                              className="progress-bar"
                              style={{ width: `${betStats.winRate}%` }}
                              role="progressbar"
                            ></div>
                          </div>
                          <span className="text-nowrap w-25">
                            {betStats.winCount}/{betStats.totalBets} won
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-10">
                    <div className="card card-stats mb-4 mb-xl-0">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-8">
                            <h5 className="card-title text-uppercase text-muted mb-0">
                              Amount Bet
                            </h5>
                            <span className="h2 font-weight-bold mb-0">
                              ${betStats.amountBet}
                            </span>
                          </div>
                          <div className="col-4">
                            <div className="icon icon-shape bg-success h-75 d-flex justify-content-center align-items-center text-white rounded-circle shadow">
                              <i
                                className="fa fa-usd"
                                style={{ fontSize: "1.5rem" }}
                                aria-hidden="true"
                              ></i>
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 text-muted text-sm">
                          {betStats.profitLoss >= 0 ? (
                            <>
                              <span className="text-success me-2">
                                <i className="fa fa-arrow-up"></i>$
                                {betStats.profitLoss}
                              </span>
                            </>
                          ) : (
                            <span className="text-danger me-2">
                              <i className="fa fa-arrow-down"></i>$
                              {betStats.profitLoss}
                            </span>
                          )}
                          <span className="text-nowrap">Total Profit</span>
                        </p>
                        <div className="align-items-center d-flex my-1 row">
                          <div className="progress w-75 p-0">
                            {betStats.ROI >= 0 ? (
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${betStats.ROI}%` }}
                                role="progressbar"
                              ></div>
                            ) : (
                              <div
                                className="progress-bar bg-danger"
                                style={{ width: `${betStats.ROI*-1}%` }}
                                role="progressbar"
                              ></div>
                            )}
                          </div>
                          <span className="text-nowrap w-25">
                            {betStats.ROI}% ROI
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-10">
                    <div className="card card-stats mb-4 mb-xl-0 h-100">
                      <div className="card-body">
                        <div className="row">
                          <div className="col">
                            <h5 className="card-title text-uppercase text-muted mb-0">
                              Average Odds
                            </h5>
                            <span className="h2 font-weight-bold mb-0">
                            {betStats.averageOdds}
                            </span>
                          </div>
                          <div className="col-4">
                            <div className="icon icon-shape bg-primary h-75 d-flex justify-content-center align-items-center text-white rounded-circle shadow">
                              <i
                                className="fa fa-database"
                                style={{ fontSize: "1.5rem" }}
                                aria-hidden="true"
                              ></i>
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 text-muted text-sm">
                          <span className="text-nowrap w-25">
                            {betStats.pendingCount}/{betStats.totalBets} pending
                          </span>
                        </p>
                        <div className="align-items-center d-flex mt-3 my-1 row">
                          <div className="progress w-75 p-0">
                            <div
                              className="progress-bar"
                              style={{ width: `${parseInt(betStats.pendingCount/betStats.totalBets*100)}%` }}
                              role="progressbar"
                            ></div>
                          </div>
                          <span className="text-nowrap w-25">
                            {/* {betStats.pendingCount}/{betStats.totalBets} pending */}
                            pending %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Row>
        <Row>
          {performanceNotice()}
        </Row>
        <BettingHistory></BettingHistory>
      </Container>
    </>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import MoneyLineForm from "./MoneyLineForm";
import SpreadForm from "./SpreadForm";
import { Row, Form, Container, Col, Button, Select } from "react-bootstrap";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const PlaceBets = (props) => {
  const [stakeThreshold, setSteakThreshold] = useState(0);
  const [betFrequency, setBetFrequency] = useState(0);
  const [betLimit, setBetLimit] = useState(0);
  const [betHabits, setBetHabits] = useState({})
  const { id } = props
   useEffect(() => {
     if (id != "") {
      getBetThreshold();
      getBetFrequency();
      getUserBetLimit();
      getBetHabits();
     }
  }, [id]);

  const getBetThreshold = async () => {
    let thresholdUrl = "http://localhost:3001/api/stake-threshold";
    await axios
      .get(thresholdUrl, {
        params: {
          id: props.id
        },
      })
      .then(function(response) {
        setSteakThreshold(response.data.stakeThreshold);
        console.log(response.data.stakeThreshold);
        console.log(stakeThreshold);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  const getBetFrequency = async () => {
    let betFreqUrl = "http://localhost:3001/api/bet-frequency";
    await axios
      .get(betFreqUrl, {
        params: {
          id: props.id
        },
      })
      .then(function(response) {
        setBetFrequency(response.data.betCountLast1h);
        console.log(response.data.betCountLast1h);
        console.log(betFrequency);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  const getUserBetLimit = async () => {
    let betlimitUrl = "http://localhost:3001/api/bet-limit";
    await axios
    .get(betlimitUrl, {
      params: {
        id: props.id
      },
    })
    .then(function(response) {
      setBetLimit(response.data.betLimit);
      console.log("bet limit - ",response.data.betLimit);
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  const getBetHabits = async () => {
    let betHabitsURL = "http://localhost:3001/api/bet-habits";
    await axios
    .get(betHabitsURL, {
      params: {
        id: props.id
      },
    })
    .then(function(response) {
      setBetHabits(response.data)
      console.log(response.data);
    })
    .catch(function(error) {
      console.log(error);
    })
  }

  const onChange = (e) => {
    let url = "http://localhost:3001/api/place-bets-file";
    let file = e.target.files[0];
    console.log(file);
    uploadFile(url, file);
  };

  const uploadFile = (url, file) => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("id", props.id);

    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [betForms, setBets] = useState([]);
  const [deletedForms, setDeletedForms] = useState([]);
  const [numForms, setNumForms] = useState(0);
  const [betFormDetails, setBetFormDetails] = useState(false);
  const [betFormsData, setBetFormsData] = useState([]);
  const [betFormsNew, setNewBets] = useState([]);
  const [formDetails, setFormDetails] = useState({
    stake: "",
    payout: "",
    sportsBook: "",
  });

  const AddMoneyLine = () => {
    if (numForms >= 0) setBetFormDetails(true);

    setNumForms(numForms + 1);
    betForms.push({
      id: numForms,
      form: (
        <MoneyLineForm
          onFormUpdate={handleFormUpdate}
          onDeleteForm={handleFormDelete}
          key={numForms}
          type={"Moneyline"}
          number={numForms}
        />
      ),
    });
  };
  const AddSpread = () => {
    if (numForms >= 0) setBetFormDetails(true);

    setNumForms(numForms + 1);
    betForms.push({
      id: numForms,
      form: (
        <SpreadForm
          onFormUpdate={handleFormUpdate}
          onDeleteForm={handleFormDelete}
          key={numForms}
          type={"Spread"}
          number={numForms}
        />
      ),
    });

    if (betForms.length > 0) setBetFormDetails(true);
  };

  const handleFormUpdate = (form) => {

    betFormsData[form.id] = form;
  };

  useEffect(() => {
    setBets(betFormsNew);
    console.log(betForms);
  }, [betFormsNew]);

  const handleFormDelete = (id) => {
    betFormsData[id] = { id: null };
    deletedForms.push(id);

    let newBetFormsTemp = betForms.filter((e) => {
      return !deletedForms.includes(e.id);
    });
    setNewBets(newBetFormsTemp);

    if (newBetFormsTemp.length == 0) {
      setBetFormDetails(false);
      // setNumForms(0);
    } else {
      setBetFormDetails(true);
    }
  };

  const handleOnChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFormDetails({ ...formDetails, [name]: value });
  };

  const submitForm = (postData) => {
    let url = "http://localhost:3001/api/place-bets-form";
    axios
      .post(url, postData, {})
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const SubmitBets = (e) => {
    let updatedForm = betFormsData.filter((e) => {
      return e.id != null;
    });
    e.preventDefault();
    let postData = {
      id: props.id,
      stake: formDetails.stake,
      payout: formDetails.payout,
      sportsbook: formDetails.sportsBook,
      betContents: updatedForm,
    };
    
    // CHECK FOR HIGH STAKE, FREQUENT BET
    // A + B + C
    if (stakeThreshold != 0 && formDetails.stake > stakeThreshold && betFrequency > 8 && formDetails.stake > betLimit) {
      confirmAlert({
        title: 'NOTICE',
        message: 'You have placed more tha 8 bets in the last hour, your stake is unusually high and you have exceeded your set stake limit. Please feel free to reach out to the Reponsible Gambling page on this site.',
        buttons: [
          {
            label: 'Continue',
            onClick: () => submitForm(postData)
          },
          // {
          //   label: 'OK',
          // }
        ]
      });
      
    } else if (stakeThreshold != 0 && formDetails.stake > stakeThreshold && betFrequency > 8){ // A + B
      confirmAlert({
        title: 'NOTICE',
        message: 'You have placed more than 8 bets in the last hour and your stake is unusually high. Please feel free to reach out to the Reponsible Gambling page on this site.',
        buttons: [
          {
            label: 'Continue',
            onClick: () => submitForm(postData)
          }
          // {
          //   label: 'OK',
          // }
        ]
      });
    } else if (stakeThreshold != 0 && formDetails.stake > stakeThreshold && formDetails.stake > betLimit) { // A + C
       confirmAlert({
        title: 'NOTICE',
        message: 'Your stake is unusually high and has exceeded the set limit, are you sure you want to submit?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => submitForm(postData)
          },
          {
            label: 'No',
          }
        ]
      });
    } else if (stakeThreshold && betFrequency > 8 && formDetails.stake > betLimit) { // B + C
        confirmAlert({
        title: 'NOTICE',
        message: 'You have placed more than 8 bets in the last hour and has exceeded the set stake limit, please visit our Responsible Gambling page.',
        buttons: [
          {
            label: 'Continue',
            onClick: () => submitForm(postData)
          },
          // {
          //   label: 'No',
          // }
        ]
      });
    } else if (betFrequency > 8 ) { // B
      confirmAlert({
        title: 'NOTICE',
        message: 'You have submitted more than 8 bets in the last hour please visit our Responsible Gambling page.',
        buttons: [
          {
            label: 'Continue',
            onClick: () => submitForm(postData)
          }
          // {
          //   label: 'No',
          // }
        ]
      });
    } else if (stakeThreshold != 0 && formDetails.stake > stakeThreshold) { // A
       confirmAlert({
        title: 'NOTICE',
        message: 'Your stake is unusually high, are you sure you want to submit?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => submitForm(postData)
          },
          {
            label: 'No',
          }
        ]
      });
    } else if(formDetails.stake > betLimit) {
      console.log("bet limit - ", betLimit);
       confirmAlert({
        title: 'NOTICE',
        message: 'You have exceed the set bet amount!',
        buttons: [
          // {
          //   label: 'Yes',
          //   onClick: () => submitForm(postData)
          // },
          {
            label: 'Got it',
          }
        ]
      });
    } else if (stakeThreshold && betFrequency > 8) {
       confirmAlert({
        title: 'NOTICE',
        message: 'You placed more than 8 bets in the last hour, please visit our page on repsonsible gambling for tips on safe betting.',
        buttons: [
          // {
          //   label: 'Yes',
          //   onClick: () => submitForm(postData)
          // },
          {
            label: 'OK',
          }
        ]
      });
    }
    else {
      submitForm(postData)
    }
  };
  const recommend = () => {
    let favoredTeam = betHabits.favouredTeam;
    if(betHabits.winCount > betHabits.lossCount) {
      return <p className="text-center"> We noticed you're a big fan of the {favoredTeam} with {betHabits.winCount} wins so far. If you like to place another bet please navigate to Add Bet found at the bottom of this page. </p>
    } else {
      return <p className="text-center">We noticed you're a big fan of the {favoredTeam}, unfortunately with {betHabits.lossCount} losses, you may want to visit our Betting Tips page to find tips and tricks to increase win rate.</p>
    }
  };
  return (
    <>
      <Container>
        <Row>
          <h1 className="text-center headingLine">Place Bets</h1>
          <img
            className="bets-logo"
            src="https://img.icons8.com/external-others-maxicons/100/000000/external-bet-gambling-others-maxicons-3.png"
          />
        </Row>
        <Row>
          <h3 className="text-center headingLine">Recommendations</h3>
          {
            recommend()
          }
        </Row>
        <Row className="mrgn-btm-3p justify-content-center">
          <h5 className="text-center headingLine">Upload .csv</h5>
          <Col xs="12" md="4">
            <input
              className="form-control"
              type="file"
              onChange={onChange}
              accept=".csv"
            />
          </Col>
        </Row>

        <Row className="mrgn-btm-3p justify-content-center">
          <h5 className="text-center headingLine">Add Bet</h5>
          <Col
            xs="12"
            md="5"
            className="justify-content-around d-flex align-self-center mb-5"
          >
            <button
              type="button"
              onClick={AddMoneyLine}
              className="p-3 btn btn-primary"
            >
              Add Money Line
            </button>
            <button
              type="button"
              onClick={AddSpread}
              className="p-3 btn btn-primary"
            >
              Add Spread
            </button>
          </Col>

          <form className="submit-bets-form" onSubmit={SubmitBets}>
            {betFormDetails ? (
              <div className="d-flex justify-content-evenly bet-details flex-row">
                <div className="mb-3">
                  <label htmlFor="exampleInputStake" className="form-label">
                    Stake
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="exampleInputStake"
                    name="stake"
                    onChange={handleOnChange}
                    value={formDetails.stake}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPayout" className="form-label">
                    Payout
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="exampleInputPayout"
                    name="payout"
                    onChange={handleOnChange}
                    value={formDetails.payout}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="exampleInputSportsBook"
                    className="form-label"
                  >
                    SportsBook
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputSportsBook"
                    name="sportsBook"
                    onChange={handleOnChange}
                    value={formDetails.sportsBook}
                    required
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn w-100 mt-4 mb-3 rounded-pill btn-outline-danger"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className="d-flex flex-row flex-wrap justify-content-center">
              {betForms.map((item) => {
                return item.form;
              })}
            </div>
          </form>
        </Row>
      </Container>
    </>
  );
};

export default PlaceBets;

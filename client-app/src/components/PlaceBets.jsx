import React, { useEffect, useState } from "react";
import axios from "axios";
import MoneyLineForm from "./MoneyLineForm";
import SpreadForm from "./SpreadForm";
import { Row, Form, Container, Col, Button, Select } from "react-bootstrap";

const PlaceBets = (props) => {
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

  const SubmitBets = () => {
    let updatedForm = betFormsData.filter((e) => {
      return e.id != null;
    });

    let postData = {
      id: props.id,
      stake: formDetails.stake,
      payout: formDetails.payout,
      sportsbook: formDetails.sportsBook,
      betContents: updatedForm,
    };
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

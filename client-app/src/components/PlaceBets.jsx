import React, { useEffect, useState } from "react";
import axios from "axios";
import MoneyLineForm from "./MoneyLineForm";
import SpreadForm from "./SpreadForm";

const PlaceBets = (props) => {
  useEffect(() => {});

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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [betForms, setBets] = useState([]);
  const [numForms, setNumForms] = useState(0);
  const [betFormDetails, setBetFormDetails] = useState(false);

  const [betFormsData, setBetFormsData] = useState(
   [] 
  );

  const [formDetails, setFormDetails] = useState({
    stake: "",
    payout: "",
    sportsBook: "",
 
  });

  const AddMoneyLine = () => {
    if (numForms == 0) setBetFormDetails(true);

    setNumForms(numForms + 1);
    betForms.push(
      <MoneyLineForm
        onFormUpdate={handleFormUpdate}
        key={numForms}
        type={"Moneyline"}
        number={numForms}
      />
    );
  };
  const AddSpread = () => {
    if (numForms == 0) setBetFormDetails(true);
    setNumForms(numForms + 1);
    betForms.push(
      <SpreadForm
        onFormUpdate={handleFormUpdate}
        key={numForms}
        type={"Spread"}
        number={numForms}
      />
    );
  };

  const handleFormUpdate = (form) => {
    if(form.result=="Loss")
      setFormDetails({ ...formDetails, ['payout']: 0 });
    betFormsData[form.id]=form;
   
  };

  const handleOnChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFormDetails({ ...formDetails, [name]: value });
  };

  const SubmitBets = () => {
    let postData = {
      id:props.id,
      stake: formDetails.stake,
      payout: formDetails.payout, 
      sportsbook: formDetails.sportsBook,
      betContents: betFormsData
    }
    let url = "http://localhost:3001/api/place-bets-form";
    axios
    .post(url, postData, {
    })
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
      <div>Upload .csv</div>

      <input type="file" onChange={onChange} accept=".csv" />

      <p className="p-5">
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
      </p>

      {betFormDetails ? (
        <div className="d-flex px-5 flex-row">
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
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputSportsBook" className="form-label">
          SportsBook
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputSportsBook"
            name="sportsBook"
            onChange={handleOnChange}
            value={formDetails.sportsBook}
          />
        </div>
        </div>
        
      ) : (
        <></>
      )}

      <div className="d-flex flex-row flex-wrap" id="children-pane">
        {betForms}
      </div>

      {betFormDetails ? (
        <div className="w-50">
          <button
            type="submit"
            className="btn w-100 mt-4 mb-3 rounded-pill btn-outline-danger"
            onClick={SubmitBets}
          >
            Submit
          </button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PlaceBets;

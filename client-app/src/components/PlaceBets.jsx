import React, { useEffect, useState } from "react";
import axios from "axios";
import MoneyLineForm from "./MoneyLineForm";
import SpreadForm from "./SpreadForm";

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
    if (numForms == 0) setBetFormDetails(true);

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
    if (form.result == "Loss")
      setFormDetails({ ...formDetails, ["payout"]: 0 });

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



      <form onSubmit={SubmitBets}>
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
              required
            />
          </div>
        </div>
      ) : (
        <></>
      )}
        <div className="d-flex flex-row flex-wrap">
          {betForms.map((item) => {
            return item.form;
          })}
        </div>
        {betFormDetails ? (
          <div className="w-50">
            <button
              type="submit"
              className="btn w-100 mt-4 mb-3 rounded-pill btn-outline-danger"
            >
              Submit
            </button>
          </div>
        ) : (
          <></>
        )}
      </form>
    </>
  );
};

export default PlaceBets;

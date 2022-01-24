import React, { useEffect, useState } from "react";


const MoneyLineForm = (props) => {

  const [form, setForm] = useState({
    id:props.number,
    type:props.type,
    date: "",
    sport: "",
    home: "",
    away: "",
    selection: "",
    odds: "",
    result: "",
  });

  useEffect(() => {
    props.onFormUpdate(form);
  }, [form]);

  const handleOnChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };


  return (
    <>

      <div className="w-25 p-4 mx-auto">
        Money Line {props.number}
        <form>
          <div className="mb-3">
            <label htmlFor="exampleInputDate" className="form-label">
              Date
            </label>
            <input
              type="date"
              className="form-control"
              id="exampleInputDate"
              name="date"
              onChange={handleOnChange}
              value={form.date}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputSport" className="form-label">
              Sport
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputSport"
              name="sport"
              onChange={handleOnChange}
              value={form.sport}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputHomeTeam" className="form-label">
              Home Team
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputHomeTeam"
              name="home"
              onChange={handleOnChange}
              value={form.home}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputAwayTeam" className="form-label">
              Away Team
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputAwayTeam"
              name="away"
              onChange={handleOnChange}
              value={form.away}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputSelection" className="form-label">
              Selection Team
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputSelection"
              name="selection"
              onChange={handleOnChange}
              value={form.selection}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputOdds" className="form-label">
              Odds
            </label>
            <input
              type="number"
              className="form-control"
              id="exampleInputOdds"
              name="odds"
              onChange={handleOnChange}
              value={form.odds}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputResult" className="form-label">
              Result
            </label>

            <select
              className="form-control"
              onChange={handleOnChange}
              name="result"
              id="exampleInputResult"
              value={form.result}
            >
              <option defaultValue></option>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
            </select>
          </div>
    
        </form>
      </div>
    </>
  );
};

export default MoneyLineForm;

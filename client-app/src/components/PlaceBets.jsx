import React, { useEffect } from "react";
import axios from 'axios';

const PlaceBets = (props) => {
  useEffect(() => {});

  const onChange = (e) => {
    let url = "http://localhost:3001/api/place-bets-file";
    let file = e.target.files[0];
    console.log(file);
    uploadFile(url, file);
  };

  const uploadFile = (url, file) => {
    console.log(props.id);
    let formData = new FormData();
    formData.append("file", file);
    formData.append("id", props.id);
    console.log(formData);
    axios
      .post(url, formData,  {
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

  return (
    <>
      <div>Upload .csv</div>

      <input type="file" onChange={onChange} accept=".csv" />
    </>
  );
};

export default PlaceBets;

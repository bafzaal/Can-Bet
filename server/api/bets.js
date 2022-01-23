const express = require("express");
const csv = require('csv-parser')
const { Readable } = require('stream');

const Bets = require("./models/userSchema");


var router = express.Router();



router.post("/api/place-bets-file", function (req, res) {
  // console.log(req.files);

  if (!req.files) {
    res.send("File was not found");
    return;
  }
  const file = req.files.file;


  const bufStream = Readable.from(file.data.toString());

  console.log(bufStream);
  const results = [];
  // var buf = Buffer.from(file.data);
  bufStream
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      console.log(results);
      // [
      //   { NAME: 'Daffy Duck', AGE: '24' },
      //   { NAME: 'Bugs Bunny', AGE: '22' }
      // ]
    });

  console.log(results);

  return res.status(200).json({ success: true });


});





module.exports = router;
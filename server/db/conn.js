const mongoose = require('mongoose');

const db = process.env.DATABASE;

mongoose.connect(db, {
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(() => {
    console.log("Database Connected")
}).catch((e) => {
    console.log(e);
})
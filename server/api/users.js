const express = require("express");
const Users = require("../models/userSchema");
const bcryptjs = require("bcryptjs");

var router = express.Router();

router.put("/api/update-user-bet-limit", async (req, res) => {
    let id = req.body.id;
    const newLimit = req.body.stakeLimit;

    if (!newLimit) {
        res.send("stake limit was not found");
        return;
    }

    content = req.body

    const user = await Users.findById(id).exec();

    //if(!user.stakeLimit) {
        // if (newLimit != user.stakeLimit) {
            //Check Password
            const password = req.body.oldPassword;
            const email = req.body.email;
            const username = req.body.username;
            const match = await bcryptjs.compare(password, user.password);
            if (true) {
                // if(newpassword != null &&  newpassword != "") {
                //     user.password = newpassword;
                // }
                Users.updateOne(
                    {_id: id}, 
                    {
                        stakeLimit: newLimit,
                    },
                    {multi: true}, function(err, numberAffected){
                       
                    });
            }
    return res.status(200).json({match});
});

router.get("/api/bet-limit", async (req, res) => {
    let id = req.query.id;
    //console.log(id)
    
    const user = await Users.find({_id: id});

   
    return res.status(200).json({betLimit: user[0].stakeLimit});
});

module.exports = router;
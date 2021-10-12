const express = require('express');
const { user } = require('../models/user');
const {welcomeEmail} = require('../mails/welcomeEmail');
const userRouter = express.Router();

userRouter.post('/', async (req, res) => {
    const newUser = new user(req.body);
    try {
        let client = await user.create(newUser);
        welcomeEmail(client);
        return res.status(201).json({
            message : "user sucessfully created",
            user: client,
        })
    } catch(err) {
        return res.status(400).json({
            message : err.message,
        })
    }
});


module.exports = {userRouter};
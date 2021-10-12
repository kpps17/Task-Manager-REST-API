const express = require('express');
const { user } = require('../models/user');
const { welcomeEmail } = require('../mails/welcomeEmail');
const userRouter = express.Router();
const bcryptjs = require('bcryptjs');

userRouter.post('/', async (req, res) => {
    const newUser = new user(req.body);
    try {
        let client = await user.create(newUser);
        let token = await client.getAuthToken();
        welcomeEmail(client);
        return res.status(201).send({
            message: "user sucessfully created",
            user: client,
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        })
    }
});

userRouter.post('/login', async (req, res) => {
    const clientEmail = req.body.email, clientPassword = req.body.password;
    try {
        let client = await user.findOne({ email: clientEmail });
        if (client) {
            const isVerified = await bcryptjs.compare(clientPassword, client.password);
            if (isVerified) {
                return res.status(200).json({
                    client
                })
            } else {
                res.status(404).json({
                    message: "email or password is invalid",
                })
            }
        } else {
            res.status(404).json({
                message: "email or password is invalid",
            })
        }
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        })
    }
})

module.exports = { userRouter };
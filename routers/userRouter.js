const express = require('express');
const { user } = require('../models/user');
const { welcomeEmail } = require('../mails/welcomeEmail');
const userRouter = express.Router();
const bcryptjs = require('bcryptjs');
const { authHelper } = require('../middleware/authUser');

userRouter.post('/', async (req, res) => {
    const newUser = new user(req.body);
    try {
        let client = await user.create(newUser);
        let token = await client.getAuthToken();
        welcomeEmail(client);
        return res.status(201).send({
            user: client,
            token,
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
                let token = await client.getAuthToken();
                res.cookie('login', token, { httpOnly: true });
                return res.status(200).json({
                    message: "user logged in",
                    client,
                    token
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

userRouter.post('/logout', authHelper, async (req, res) => {
    try {
        req.client.tokens = req.client.tokens.filter(token => token.token !== req.token);
        await req.client.save();
        return res.status(200).json({
            success: 'Logged out successfully!'
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
})

userRouter.post('/logoutAll', authHelper, async (req, res) => {
    try {
        req.client.tokens = [];
        await req.client.save();
        return res.status(200).json({
            success: "logged out all devices",
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
})

userRouter.get('/me', authHelper, (req, res) => {
    return res.status(200).send(req.client);
})

userRouter.patch('/me', authHelper, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    let isValid = false;
    if(updates.length) {
        isValid = updates.every(update => allowedUpdates.includes(update));
    }
    if(isValid == false) return res.status(400).json( { message: 'no updates or invalid updates are being applied'});
    try {
        updates.forEach(update => req.client[update] = req.body[update]);
        await req.client.save();
        return res.status(200).json({message : "successfully updated"});
    } catch(err) {
        return res.status(400).json( { message : err.message } )
    }
})

module.exports = { userRouter };
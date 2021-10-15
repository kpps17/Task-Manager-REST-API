const express = require('express');
const { authHelper } = require('../middleware/authUser');
const { task } = require('../models/task');
const taskRouter = express.Router();

taskRouter.post('/', authHelper, async (req, res) => {
    const newTask = new task({ ...req.body, owner: req.client._id });
    try {
        let createdTask = await task.create(newTask);
        res.status(201).json({
            createdTask,
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        })
    }
});

module.exports = { taskRouter };
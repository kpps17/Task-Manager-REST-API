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

taskRouter.get('/:id', authHelper, async (req, res) => {
    const _id = req.params.id;
    console.log(_id);
    try {
        const userTask = await task.findOne({_id, owner: req.client._id});
        if(!userTask) {
            res.status(400).json({
                message: "no task found",
            })
        }
        res.status(200).json({
            userTask,
        })
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
})

module.exports = { taskRouter };
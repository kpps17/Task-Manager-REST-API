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

taskRouter.patch('/:id', authHelper, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    let isValid;
    if (updates.length) {
        isValid = updates.every( update => allowedUpdates.includes(update) );
    } else {
        isValid = false;
    }
    if(!isValid) {
        return res.status(400).send({ error: 'Invalid updates being applied' });
    }
    try {
        const Task = await task.findOne({ _id: req.params.id, owner: req.client._id});
        if (!Task) return res.status(404).json({message: "no such task available"});
        updates.forEach( update => Task[update] = req.body[update]);
        await Task.save();
        res.status(200).json({Task});
    } catch(err) {
        res.status(400).json({message: err.message});
    }
})

taskRouter.delete('/:id', authHelper, async(req, res) => {
    try {
        const taskToDelete = await task.findOneAndDelete({_id: req.params.id, owner: req.client._id});
        if(!taskToDelete) {
            res.status(400).json({message: "no tasks found"});
        } 
        res.status(200).json({taskToDelete});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

module.exports = { taskRouter };
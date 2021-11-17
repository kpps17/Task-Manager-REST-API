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

taskRouter.get('/', authHelper, async (req, res) => {
    try {
        let taskofUser = await task.find({owner: req.client._id});
        if(!taskofUser) {
            return res.status(400).json( {message: "no task for user"} );
        } 
        if(!req.query.completed) 
            return res.status(200).json(taskofUser);
        let editTaskList = taskofUser.filter((task) => {
            console.log(req.query.completed);
            if(task.status == (req.query.completed === 'true')) 
                return true;
            return false;
        })
        return res.status(200).json(editTaskList);
    } catch(err) {
        return res.status(400).json( {message: err.message} );
    }
})

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
    const allowedUpdates = ['description', 'status'];
    let isValid;
    if (updates.length) {
        isValid = updates.every( update => allowedUpdates.includes(update) );
    } else {
        isValid = false;
    }
    if(!isValid) {
        return res.status(400).send({ error: 'Invalid updates being applied' });
    }
    const _id = req.params.id;
    try {
        const taskToBeUpdated = await task.findOne({_id, owner: req.client._id});
        if(!taskToBeUpdated) {
            return res.status(400).json({ message: "no such task found" })
        }
        console.log(updates);
        updates.forEach(update => taskToBeUpdated[update] = req.body[update]);
        await taskToBeUpdated.save();
        return res.status(400).json(taskToBeUpdated);
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
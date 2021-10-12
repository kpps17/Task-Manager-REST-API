const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    }
}, {
    timestamps: true
});

const task = mongoose.model('task', taskSchema);

module.exports = {task};
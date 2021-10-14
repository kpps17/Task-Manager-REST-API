const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const task = require('./task');
const { JWT_KEY, salt } = require('../secrets');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid email address')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 6,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
}, {
    timestamps: true,
});

userSchema.virtual(('task'), {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner',
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

userSchema.methods.getAuthToken = async function () {
    const user = this;
    const payload = user['_id'];
    const token = jwt.sign({ id: payload }, JWT_KEY);
    user.tokens = user.tokens.concat([{ token: token.toString() }]);
    await user.save()
    console.log('here in getAuthToken');
    return token;
}


userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, salt);
    }
    next();
})

userSchema.pre('remove', async function (next) {
    const user = this;
    await task.deleteMany({ owner: user._id });
    next();
})

const user = mongoose.model('users', userSchema);

module.exports = { user };
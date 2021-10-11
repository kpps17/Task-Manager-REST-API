const mongoose = require('mongoose');
const { dbLink } = require('../secrets');

mongoose.connect(dbLink).then((db) => {
    console.log('database connected');
})
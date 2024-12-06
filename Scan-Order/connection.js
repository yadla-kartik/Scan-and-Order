const mongoose = require('mongoose');

async function connectDB(url) {
    mongoose.connect(url);
}

module.exports = {
    connectDB
}
const mongoose = require('mongoose');
const { applyapplyTimestamps } = require('./user')

const food_schema = new mongoose.Schema({
    userItem:[{
        name:{
            type: String,
        },
        description:{
            type: String,
        },
        price:{
            type: String,
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        quantity:{
            default: 1,
            type: Number,
            required: true,
        },
        status:{
            type: String,
            default: 'Pending'
        },
        paymentStatus:{
            type: String,
            default: 'Pending'
        }
    }]
},{timestamps: true})

const Food = mongoose.model('food', food_schema);

module.exports = Food;
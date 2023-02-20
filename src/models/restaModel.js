const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const resutSchema = new mongoose.Schema({

    restaurantName: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique : true
    },
    password: {
        type: String,
        require: true,
        trim: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Restaurant' , resutSchema)
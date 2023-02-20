const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const dishSchema = new mongoose.Schema({

    restaurantId :{
        type: ObjectId,
        ref: "Restaurant",
        required: true
    },
    dishName: {
        type: String,
        require: true,
        trim: true,
        unquie : true
    }, 
    price: {
        type: Number,
        require: true,
        trim: true
    },
    description: {
        type: String,
        require: true,
        trim: true
    },
    dishIimages: {
        type: String,
    }

}, {timestamps : true})

module.exports = mongoose.model('Dish', dishSchema)
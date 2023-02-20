const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    email :{
        type: String,
        require: true,
        trim: true,
        unquie : true
    },
    userName :{
        type: String,
        require: true,
        trim: true,
        unquie : true
    },
    password :{
        type: String,
        require: true,
        trim: true
    },
    profileImage :{
        type: String,
        require: true
    },
    isAdmin : {
        type : Boolean,
        require : true,
        trim : true
    }
}, {timestamps : true} )


module.exports = mongoose.model('User', userSchema)
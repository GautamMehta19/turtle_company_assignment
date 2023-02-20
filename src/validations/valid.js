const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof (value) == "undefined" || typeof (value) == null) {
        return false
    }

    if (typeof (value) == "string" && (value).trim().length == 0) {
        return false
    }

    return true
}

const isValidObjectId = function (value) {
    return mongoose.Types.ObjectId.isValid(value)

}

module.exports = { isValid, isValidObjectId }
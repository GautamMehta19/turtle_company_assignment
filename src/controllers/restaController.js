let restaModel = require('../models/restaModel')
let jwt = require('jsonwebtoken')
let valid = require('../validations/valid')


const createResta = async function (req, res) {
    try {
        let data = req.body

        let { restaurantName, email, password } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({
                status: false,
                message: "Body should not be empty please provide some data for create Restaurant"
            })
        }


        if (!valid.isValid(restaurantName)) {
            return res.status(400).send({
                status: false,
                message: "restaurantName is required"
            })
        }

        if (!valid.isValid(email)) {
            return res.status(400).send({
                status: false,
                message: "email is required"
            })
        }

        if (!valid.isValid(password)) {
            return res.status(400).send({
                status: false,
                message: "password is required"
            })
        }

        let createdResta = await restaModel.create(data)
        return res.status(201).send({
            status: true,
            message: 'Restaurant successfully created',
            data: createdResta
        })
    }
    catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}


//******************************************************************************************************************************************** */


const loginResta = async function (req, res) {
    try {

        let data = req.body

        let { email, password } = data

        if (Object.keys(data).length == 0 ) {
            return res.status(400).send({
                status: false,
                message: "please put atleast one key for updating"
            })
        }

        let getResta = await restaModel.findOne({ email: email })

        if (!getResta) {
            return res.status(404).send({
                status: true,
                message: 'Not Found Restaurant with this email'
            })
        }

        if (getResta.password != password) {
            return res.status(404).send({
                status: true,
                message: 'Please Check Your Login Credential'
            })
        }

        let token = jwt.sign({
            restaurantId: getResta._id,
            iat: new Date().getTime()
        }, "turtle_Project",)

        return res.status(200).send({
            status: true,
            messge: "User login successfull",
            data: { restaurantId: getResta._id, token: token }
        })
    }
    catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}


//******************************************************************************************************************************************** */




const getRes = async function (req, res) {
    try {

        let getRes = await restaModel.find()
        if (!getRes) {
            return res.status(404).send({
                status: false,
                message: "restaurantId not found in DB"
            })

        }

        return res.status(200).send({
            status: true,
            message: "Success",
            data: getRes
        })
    }
    catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}


//******************************************************************************************************************************************** */




const updateRestaurent = async function (req, res) {
    try {
        let data = req.body
        let restaurantId = req.params.restaurantId

        if (Object.keys(data).length == 0 ) {
            return res.status(400).send({
                status: false,
                message: "please put atleast one key for updating"
            })
        }

        if (!valid.isValidObjectId(restaurantId)) {
            return res.status(400).send({
                status: false,
                message: "invalid restaurantId"
            })
        }


        let { restaurantName, email, password } = data
        let obj = {}

        if(restaurantName){
            obj['restaurantName'] = restaurantName
        }

        if(email){
            obj['email'] = email
        }

        if(password){
            obj['password'] = password
        }

        let updatedData = await restaModel.findOneAndUpdate({ _id: restaurantId }, obj , { new: true })
        return res.status(200).send({
            status: true,
            message: "Success Updated",
            data: updatedData
        })
    }
    catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}




//******************************************************************************************************************************************** */



const deleteRestaruant = async function (req, res) {
    try {
        let restaurantId = req.params.restaurantId
        
        if (!valid.isValidObjectId(restaurantId)) {
            return res.status(400).send({
                status: false,
                message: "invalid restaurantId"
            })
        }

        await restaModel.remove({ _id: restaurantId })

        return res.status(200).send({
            status: true,
            message: 'successfully deleted'
        })
    }
    catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}




module.exports = { createResta, loginResta, getRes, updateRestaurent, deleteRestaruant }
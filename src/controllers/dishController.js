let dishModel = require('../models/dishModel')
let valid = require('../validations/valid')
const aws = require("aws-sdk")



const createDish = async function (req, res) {
    try {
        let data = req.body
        let { dishName, description, price } = data

        if (Object.keys(data).length == 0 && req.files.length == 0) {
            return res.status(400).send({
                status: false,
                message: "Body should not be empty please provide some data for create product"
            })
        }


        if (!valid.isValid(dishName)) {
            return res.status(400).send({
                status: false,
                message: "title is required"
            })
        }

        let checkDish = await dishModel.findOne({ dishName: dishName })
        if (checkDish) {
            return res.status(400).send({
                status: false,
                message: "title is already present in the DB"
            })
        }

        if (!valid.isValid(description)) {
            return res.status(400).send({
                status: false,
                message: " description is required"
            })
        }

        if (!valid.isValid(price)) {
            return res.status(400).send({
                status: false,
                message: "price is required"
            })
        }


        let files = req.files
        if (!files || files.length == 0) return res.status(400).send({
            status: false, message: "product image is required and also insert product Image"
        })
        let dishIimages = await uploadFile(files[0])
        data.dishIimages = dishIimages


        const dishCreated = await dishModel.create(data)
        return res.status(201).send({
            status: true, message: "Success",
            data: dishCreated
        })
    }
    catch (err) {
        return res.status(500).send({
            status: false,
            error: err.message
        })
    }
}



//************************************************************************************************************************************************ */
aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    // "AKIAY3L35MCRZNIRGT6N",
    // "AKIAY3L35MCRVFM24Q7U",
    secretAccessKey: "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",
    // "9f+YFBVcSjZWM6DG9R4TUN8k8TGe4X+lXmO4jPiU",
    // "qGG1HE0qRixcW1T1Wg1bv+08tQrIkFVyDFqSft4J",
    region: "ap-south-1"
})


let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        let s3 = new aws.S3({ apiVersion: '2006-03-01' })

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "projectGroup44/" + file.originalname,
            Body: file.buffer
        }

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            // console.log("file uploaded succesfully")
            return resolve(data.Location)
        })
    })
}
//************************************************************************************************************************************************ */




const getDish = async function (req, res) {
    try {

        const restaurantId = req.params.restaurantId

        if (!valid.isValidObjectId(restaurantId)) {
            return res.status(400).send({
                status: false,
                message: "invalid restaurantId"
            })
        }

        let get = await dishModel.find({ restaurantId: restaurantId }).populate("restaurantId")

        if (get.length == 0) {
            return res.status(404).send({
                status: false,
                message: "data not found or please check your restaurantId",
                data: []
            })
        }

        return res.status(200).send({
            status: true,
            message: "Success",
            data: get
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



const get = async function (req, res) {
    try {

        let getdis = await dishModel.find()
        if (!getdis) {
            return res.status(404).send({
                status: false,
                message: "data not found in DB"
            })

        }

        return res.status(200).send({
            status: true,
            message: "Success",
            data: getdis
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


const updateDish = async function (req, res) {
    try {
        let data = req.body
        let dishId = req.params.dishId
        data = JSON.parse(JSON.stringify(data))

        let { restaurantId, dishName, price, description } = data

        if (!valid.isValidObjectId(dishId)) {
            return res.status(400).send({
                status: false,
                message: "invalid dishId"
            })
        }

        if (Object.keys(data).length == 0 && !req.files) {
            return res.status(400).send({
                status: false,
                message: "please put atleast one key for updating"
            })
        }

        let obj = {}

        if (restaurantId) {
            return res.status(400).send({
                status: false,
                message: "you cant updated restaurantId"
            })
        }

        if (dishName) {
            obj.dishName = dishName
        }

        if (price) {
            obj.price = price
        }

        if (description) {
            obj.description = description
        }

        let files = req.files
        if (data.hasOwnProperty("dishIimages")) {
            if (!files || files.length == 0) {
                return res.status(400).send({
                    status: false,
                    message: "please insert dish Images"
                })
            }
        }
        if (files.length != 0) {
            let dishIimages = await uploadFile(files[0])
            obj["dishIimages"] = dishIimages
        }


        const updatedDish = await dishModel.findByIdAndUpdate({ _id: dishId }, obj, { new: true })
        if (!updatedDish) {
            return res.status(404).send({
                status: false,
                message: "product is already deleted or not found",
            })
        }

        return res.status(200).send({
            status: false,
            message: "successfully updated data",
            data: updatedDish
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

const deleteDish = async function (req, res){
    try{
        let dishId = req.params.dishId

        if (!valid.isValidObjectId(dishId)) {
            return res.status(400).send({
                status: false,
                message: "invalid dishId"
            })
        }

        await dishModel.remove({ _id: dishId })

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



module.exports = { createDish, getDish, get, updateDish, deleteDish }
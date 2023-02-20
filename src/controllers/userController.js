let userModel = require('../models/userModel')
let jwt = require('jsonwebtoken')
const aws = require("aws-sdk")



const createUser = async function(req, res){
    try{

        let data = req.body

        // let { email, userName, password } = data

        if (Object.keys(data).length == 0 && req.files.length == 0) {
            return res.status(400).send({
                status: false,
                message: "Body should not be empty please provide some data for create Restaurant"
            })
        }

        let files = req.files
        if (!files || files.length == 0) return res.status(400).send({
            status: false, message: "product image is required and also insert product Image"
        })
        let profileImage = await uploadFile(files[0])
        data.profileImage = profileImage

        let createdResta = await userModel.create(data)
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


const getUser = async function (req, res){
    try{
        let data = req.query
        let {isAdmin} = data
        console.log(data, isAdmin)

        if(isAdmin == 'false'){
            return res.status(400).send({
                status: false,
                message: "you are not authorized"
            })
        }
        let getUser = await userModel.find()
    
        if (!getUser) {
            return res.status(404).send({
                status: false,
                message: "data not found in DB"
            })
        }
        return res.status(200).send({
            status: true,
            message: " Success",
            data: getUser
        })
    }
    catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}


//************************************************************************************************************************************************ */


const updateUser = async function (req, res){
    try{
        let data = req.query
        let {isAdmin} = data

        let dataFromBody = req.body
        let userId = req.params.userId
        dataFromBody = JSON.parse(JSON.stringify(dataFromBody))

        let { email, userName, password } = dataFromBody

        if(isAdmin == 'false'){
            return res.status(400).send({
                status: false,
                message: "you are not authorized to update any document"
            })
        }

        if (Object.keys(data).length == 0 && !req.files) {
            return res.status(400).send({
                status: false,
                message: "please put atleast one key for updating"
            })
        }

        let obj = {}

        if (email) {
            obj.email = email
        }

        if (userName) {
            obj.userName = userName
        }

        if (password) {
            obj.password = password
        }

        let files = req.files
        if (data.hasOwnProperty("profileImage")) {
            if (!files || files.length == 0) {
                return res.status(400).send({
                    status: false,
                    message: "please insert profile Image"
                })
            }
        }
        if (files.length != 0) {
            let profileImage = await uploadFile(files[0])
            obj["profileImage"] = profileImage
        }


        const updatedUser = await userModel.findByIdAndUpdate({ _id: userId }, obj, { new: true })
        if (!updatedUser) {
            return res.status(404).send({
                status: false,
                message: "product is already deleted or not found",
            })
        }

        return res.status(200).send({
            status: false,
            message: "successfully updated data",
            data: updatedUser
        })
    }
    catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}


//************************************************************************************************************************************************ */



const deleteUser = async function (req, res){
    try{
        let data = req.query
        let {isAdmin} = data

        let userId = req.params.userId

        if(isAdmin == 'false'){
            return res.status(400).send({
                status: false,
                message: "you are not authorized to delete any document"
            })
        }
        await userModel.remove({ _id: userId })

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



//************************************************************************************************************************************************ */

const loginUser = async function (req, res) {
    try {

        let data = req.body

        let { userName, password } = data

        if (Object.keys(data).length == 0 ) {
            return res.status(400).send({
                status: false,
                message: "please put atleast one key for updating"
            })
        }

        let getUser = await userModel.findOne({ userName: userName })

        if (!getUser) {
            return res.status(404).send({
                status: true,
                message: 'Not Found user with this userName'
            })
        }

        if (getUser.password != password) {
            return res.status(404).send({
                status: true,
                message: 'Please Check Your Login Credential'
            })
        }

        let token = jwt.sign({
            restaurantId: getUser._id,
            iat: new Date().getTime()
        }, "turtle_Project_2",)

        return res.status(200).send({
            status: true,
            messge: "User login successfull",
            data: { userId: getUser._id, token: token }
        })
    }
    catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}


module.exports = {createUser, loginUser, getUser, updateUser, deleteUser}
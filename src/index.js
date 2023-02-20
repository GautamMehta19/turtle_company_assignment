const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const multer = require('multer')
const router = require("./routes/route")
const port = process.env.PORT || 3000
const app = express()

app.use(bodyParser.json())

app.use(multer().any());

mongoose.connect("mongodb+srv://gautam:gautam123@cluster0.xorxp.mongodb.net/turtle_project_2", {

})
    .then(() => console.log("MongoDB is connected successfully.."))
    .catch((Err) => console.log(Err))

app.use("/", router)

app.listen(port, function () {
    console.log(`Server is connected on Port ${port}`)
})
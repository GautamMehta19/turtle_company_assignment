const express = require("express")
const Router = express.Router()
const restaController = require("../controllers/restaController")
const dishController = require("../controllers/dishController")




//**************** restaruant */
Router.post("/register", restaController.createResta)

Router.post("/login", restaController.loginResta)

Router.get("/getRes", restaController.getRes)

Router.put("/updateRes/:restaurantId", restaController.updateRestaurent)

Router.delete("/deleteRes/:restaurantId", restaController.deleteRestaruant)





//*********************** dish */
Router.post("/createDish", dishController.createDish)

Router.get("/getDish/:restaurantId", dishController.getDish)

Router.get("/get", dishController.get)

Router.put('/updatedDis/:dishId', dishController.updateDish)

Router.delete('/deleteDish/:dishId', dishController.deleteDish)


Router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct or Not!"
    })
})

module.exports = Router 
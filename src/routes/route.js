const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')


router.post('/createUser', userController.createUser)
router.get('/getUser', userController.getUser)
router.put('/updateUser/:userId', userController.updateUser)
router.delete('/deleteUser/:userId', userController.deleteUser)

router.post("/login", userController.loginUser)




router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct or Not!"
    })
})


module.exports = router
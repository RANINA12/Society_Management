const express = require("express");
const router = express.Router();
const { getAllUsers, userDetails, } = require("../controller/userController");

const { handymanDetails, getAllHandyman } = require("../controller/handymanController");

// route prefix: "/api"
router.get('/user/getallusers',getAllUsers);
router.post('/user/getuser',userDetails);
router.get('/handyman/getallhandyman',getAllHandyman);
router.post('/handyman/gethandyman',handymanDetails)

module.exports = router;
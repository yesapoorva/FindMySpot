const express = require("express");
const { registerUser, authUser, updateUserDetails, getUserDetails} = require("../controllers/userControllers");
const { requireSignin } = require("../middleware/requireSignin");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", authUser);

router.put('/updateDetails', requireSignin, updateUserDetails);
router.get('/getUserDetails', requireSignin, getUserDetails);

module.exports = router;
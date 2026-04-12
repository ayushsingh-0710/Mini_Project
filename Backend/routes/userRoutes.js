const express = require("express");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);

const { registerUser } = require("../controllers/userController");
console.log({ registerUser });

router.post("/register", registerUser);

module.exports = router;
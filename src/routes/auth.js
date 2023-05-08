const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/changeDB", authController.changeDB);
router.post("/changePW", authController.changePW);
module.exports = router;

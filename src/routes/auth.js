const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const { authMiddleware } = require("../util/auth");

router.get("/login", authController.login);
router.post("/register", authController.register);

router.use(authMiddleware);

router.post("/changeDB", authController.changeDB);
router.post("/changePW", authController.changePW);
router.get("/getUser", authController.getUser);

module.exports = router;

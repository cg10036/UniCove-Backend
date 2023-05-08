const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const { verifyTokenMiddleware, authMiddleware } = require("../util/auth");

router.use(verifyTokenMiddleware);

router.use("/auth", authRouter);

router.use(authMiddleware);

module.exports = router;

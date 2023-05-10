const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const nightstudyRouter = require("./nightstudy");
const { verifyTokenMiddleware, authMiddleware } = require("../util/auth");

router.use(verifyTokenMiddleware);

router.use("/auth", authRouter);

router.use(authMiddleware);

router.use("/nightstudy", nightstudyRouter);

module.exports = router;

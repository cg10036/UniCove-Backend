const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const nightstudyRouter = require("./nightstudy");
const goodshopRouter = require("./goodshop");
const { verifyTokenMiddleware, authMiddleware } = require("../util/auth");

router.use(verifyTokenMiddleware);

router.use("/auth", authRouter);

router.use(authMiddleware);

router.use("/nightstudy", nightstudyRouter);
router.use("/goodshop", goodshopRouter);

module.exports = router;

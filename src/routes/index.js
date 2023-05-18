const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const nightstudyRouter = require("./nightstudy");
const goodshopRouter = require("./goodshop");
const boardRouter = require("./board");
const articleRouter = require("./article");
const reviewRouter = require("./review");
const { verifyTokenMiddleware, authMiddleware } = require("../util/auth");

router.use(verifyTokenMiddleware);

router.use("/auth", authRouter);

router.use(authMiddleware);

router.use("/nightstudy", nightstudyRouter);
router.use("/goodshop", goodshopRouter);
router.use("/board", boardRouter);
router.use("/article", articleRouter);
router.use("/review", reviewRouter);
module.exports = router;

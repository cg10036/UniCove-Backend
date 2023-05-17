const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/review");

router.post("/write", reviewController.write);
router.post("/list", reviewController.list);

module.exports = router;

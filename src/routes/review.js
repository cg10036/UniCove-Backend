const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/review");

router.post("/write", reviewController.write);
router.post("/list", reviewController.list);
router.post("/avg", reviewController.avg);

module.exports = router;

const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/review");

router.post("/write", reviewController.write);
router.get("/list", reviewController.list);
router.get("/avg", reviewController.avg);

module.exports = router;

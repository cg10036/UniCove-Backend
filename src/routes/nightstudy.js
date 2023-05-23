const express = require("express");
const router = express.Router();

const nightstudyController = require("../controllers/nightstudy");

router.post("/", nightstudyController.find);
router.get("/like", nightstudyController.getLike);
router.post("/like", nightstudyController.like);
router.delete("/like", nightstudyController.unlike);
router.get("/review", nightstudyController.getReviews);
router.post("/review", nightstudyController.addReview);
router.delete("/review", nightstudyController.delReview);

module.exports = router;

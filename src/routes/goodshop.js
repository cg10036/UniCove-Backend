const express = require("express");
const router = express.Router();

const goodshopController = require("../controllers/goodshop");

router.post("/", goodshopController.find);
router.get("/like", goodshopController.getLike);
router.post("/like", goodshopController.like);
router.delete("/like", goodshopController.unlike);
router.post("/review", goodshopController.addReview);
router.delete("/review", goodshopController.delReview);

module.exports = router;

const express = require("express");
const router = express.Router();

const nightstudyController = require("../controllers/nightstudy");

router.post("/", nightstudyController.find);
router.get("/like", nightstudyController.getLike);
router.post("/like", nightstudyController.like);
router.delete("/like", nightstudyController.unlike);

module.exports = router;

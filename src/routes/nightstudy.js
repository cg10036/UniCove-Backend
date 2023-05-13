const express = require("express");
const router = express.Router();

const nightstudyController = require("../controllers/nightstudy");

router.post("/", nightstudyController.find);

module.exports = router;

const express = require("express");
const router = express.Router();

const goodshopController = require("../controllers/goodshop");

router.post("/", goodshopController.find);

module.exports = router;

const express = require("express");
const router = express.Router();

const boardController = require("../controllers/board");

router.post("/list", boardController.list);
router.post("/write", boardController.write);
router.post("/search", boardController.search);

module.exports = router;

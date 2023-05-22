const express = require("express");
const router = express.Router();

const boardController = require("../controllers/board");

router.get("/list", boardController.list);
router.post("/write", boardController.write);
router.get("/search", boardController.search);
router.get("/getUser", boardController.getUser);

module.exports = router;

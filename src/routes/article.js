const express = require("express");
const router = express.Router();

const articleController = require("../controllers/article");

router.post("/comment", articleController.comment);
router.post("/like", articleController.like);
router.post("/unlike", articleController.unlike);
router.post("/read", articleController.read);

module.exports = router;

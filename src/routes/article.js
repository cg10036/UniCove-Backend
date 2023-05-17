const express = require("express");
const router = express.Router();

const articleController = require("../controllers/article");

router.post("/comment", articleController.comment);
router.post("/comment_del", articleController.comment_del);
router.post("/like", articleController.like);
router.post("/unlike", articleController.unlike);
router.post("/read", articleController.read);
router.post("/del", articleController.del);

module.exports = router;

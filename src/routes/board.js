const express = require("express");
const router = express.Router();

const boardController = require("../controllers/board");

router.post("/list", boardController.list);
router.post("/write", boardController.write);
router.post("/search", boardController.search);

router.post("/article/read", boardController.article.read);
router.post("/article/comment", boardController.article.comment);
router.post("/article/like", boardController.article.like);
router.post("/article/unlike", boardController.article.unlike);

module.exports = router;

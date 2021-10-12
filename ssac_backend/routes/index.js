var express = require("express");
var router = express.Router();

const authRouter = require("./auth/index");
const postRouter = require("./post/index");

router.use("/api/auth", authRouter);
router.use("/api/post", postRouter);

module.exports = router;

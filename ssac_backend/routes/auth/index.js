var express = require("express");
var router = express.Router();

const AuthController = require("../../controllers/AuthController");
const authModule = require("../../modules/authModule");
const upload = require("../../modules/awsUpload");

router.post("/signup", AuthController.signup);

router.post("/signin", AuthController.signin);

// router.get("/profile", authModule.loggedIn, AuthController.getAllProfile);
router.get("/profile", authModule.loggedIn, AuthController.getDetailPorfile);

router.post("/images", upload.single("img"), AuthController.uploadImage);
router.put(
  "/profile/:userId",
  authModule.loggedIn,
  AuthController.updateProfile
);

router.delete(
  "/profile/:userId",
  authModule.loggedIn,
  AuthController.deleteProfile
);

module.exports = router;

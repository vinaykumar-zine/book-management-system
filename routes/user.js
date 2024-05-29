const express = require("express");
const router = express.Router();

const { userRegistration, userLogin } = require("../controllers/user");

router.post("/", (req, res) => {
  res.status(200).send("You are in user route");
});

router.post("/register", userRegistration);
router.post("/login", userLogin);

module.exports = router;

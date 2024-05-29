const express = require("express");
const router = express.Router();

const { sellerRegistration, sellerLogin } = require("../controllers/seller");

router.post("/", (req, res) => {
  res.status(200).send("You are in user route");
});

router.post("/register", sellerRegistration);
router.post("/login", sellerLogin);

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.use("/carbon-calculator", auth, require("./carbonCalculator"));
router.use("/user", require("./user"));

module.exports = router;

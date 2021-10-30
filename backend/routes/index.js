const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.use("/carbon-calculator", auth, require("./carbonCalculator"));
router.use("/authenticate", require("./authentication"));

module.exports = router;

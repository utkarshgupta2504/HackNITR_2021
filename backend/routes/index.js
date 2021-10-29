const express = require("express");
const router = express.Router();

router.use("/carbon-calculator", require("./carbonCalculator"));

module.exports = router;

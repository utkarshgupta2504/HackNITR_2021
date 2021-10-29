const express = require("express");
const router = express.Router();
const CarbonCalculatorController = require("../controllers/carbonCalculator");



router.post("/calculate", CarbonCalculatorController.calculate);

module.exports = router;

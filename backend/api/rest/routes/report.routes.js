const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");

// POST /api/reports - Create a new report
router.post("/", reportController.createReport);

module.exports = router;

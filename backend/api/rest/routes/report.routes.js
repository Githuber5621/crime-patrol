const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const validateRequest = require("../../../middleware/validateRequest");
const {
  createReportSchema,
} = require("../../../middleware/schemas/reportSchemas");

// POST /api/reports - Create a new report
router.post(
  "/",
  validateRequest(createReportSchema),
  reportController.createReport
);

module.exports = router;

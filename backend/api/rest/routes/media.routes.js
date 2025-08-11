const express = require("express");
const multer = require("multer");
const { uploadMedia } = require("../controllers/media.cotroller.js");

const router = express.Router();

// Configure multer for in-memory storage to pass the file buffer to the controller.
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Handles file uploads via POST request.
// The file should be sent in a field named 'file'.
router.post("/upload", upload.single("file"), uploadMedia);

module.exports = router;

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadMedia = async (req, res) => {
  // Your frontend will call this endpoint first, get the file_id, and then include that ID in the POST /api/reports request.
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "crime-patrol-media" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    let media_type = "photo"; // Default
    if (req.file.mimetype.startsWith("video/")) {
      media_type = "video";
    } else if (req.file.mimetype.startsWith("audio/")) {
      media_type = "audio";
    }

    res.status(201).json({
      message: "File uploaded successfully",
      public_id: result.public_id,
      secure_url: result.secure_url,
      file_name_original: req.file.originalname,
      media_type: media_type,
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res
      .status(500)
      .json({ message: "Failed to upload file", error: error.message });
  }
};

module.exports = {
  uploadMedia,
};

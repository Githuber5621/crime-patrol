const { databases, ID } = require("../../../config/appwrite"); // Assuming this config file exists
const { DATABASE_ID, COLLECTIONS } = require("../../../constants/database"); // Assuming this constants file exists

/**
 * Creates a new report with related data (location, media).
 * Expects `incident_type`, `location`, `description` in the request body.
 * `media_attachments` is an optional array of media objects from the media upload endpoint.
 *
 * @param {import('express').Request} req The Express request object.
 * @param {import('express').Response} res The Express response object.
 */
const createReport = async (req, res) => {
  try {
    const { incident_type, location, description, media_attachments } =
      req.body;

    // 1. Create the main report document
    const reportDoc = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.REPORTS,
      ID.unique(),
      {
        incident_type,
        description,
        status: "submitted",
        incident_date: new Date().toISOString(),
      }
    );

    const reportId = reportDoc.$id;
    const relatedDataPromises = [];

    // 2. Create the associated location document
    relatedDataPromises.push(
      databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.LOCATIONS,
        ID.unique(),
        {
          ...location, // Expects an object e.g. { address, latitude, longitude }
          report_id: reportId, // Link back to the main report
        }
      )
    );

    // 3. Create associated media documents if any attachments are present
    if (media_attachments && media_attachments.length > 0) {
      media_attachments.forEach((media) => {
        relatedDataPromises.push(
          databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.MEDIA,
            ID.unique(),
            {
              report_id: reportId,
              file_id: media.public_id, // From Cloudinary
              secure_url: media.secure_url,
              cloudinary_url: media.secure_url,
              // Note: The following fields are passed from the frontend
              // after being returned by the media upload endpoint.
              media_type: media.media_type,
              file_name_original: media.file_name_original,
            }
          )
        );
      });
    }

    await Promise.all(relatedDataPromises);

    return res
      .status(201)
      .json({ message: "Report created successfully", reportId });
  } catch (error) {
    console.error("Failed to create report:", error);
    return res
      .status(500)
      .json({ message: "Error creating report", error: error.message });
  }
};

module.exports = {
  createReport,
};

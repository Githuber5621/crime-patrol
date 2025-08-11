const Joi = require("joi");

const createReportSchema = Joi.object({
  incident_type: Joi.string().trim().min(3).required(),
  location: Joi.object({
    address: Joi.string().trim().min(5).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
  }).required(),
  description: Joi.string().trim().min(10).required(),
  media_attachments: Joi.array().items(Joi.string().alphanum()).optional(),
});

module.exports = {
  createReportSchema,
};

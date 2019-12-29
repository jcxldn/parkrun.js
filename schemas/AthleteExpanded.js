const Joi = require("@hapi/joi");

/**
 * Joi Schema for Athlete (Expanded) data.
 */
module.exports = Joi.object({
  data: Joi.object({
    Athletes: Joi.array()
      .items({
        AthleteID: Joi.number().required(),
        Avatar: Joi.string().required(),
        ClubName: Joi.string().required(),
        CountryCode: Joi.number().required(),
        FirstName: Joi.string().required(),
        HomeRunID: Joi.number().required(),
        HomeRunLocation: Joi.string().required(),
        HomeRunName: Joi.string().required(),
        LastName: Joi.string().required(),
        // 'OrgSubTypeID' is null in normal responses
        OrgSubTypeID: Joi.any().forbidden(),
        OrganisationID: Joi.number().required(),
        Sex: Joi.string()
          .length(1)
          .required()
      })
      .required()
  }).required()
});

const Joi = require("@hapi/joi");

/**
 * Joi Schema for the extra Client Athlete (Expanded) data.
 */
module.exports = Joi.object({
  data: Joi.object({
    Athletes: Joi.array()
      .items({
        ClubID: Joi.number().required(),
        ConfirmCode: Joi.string().required(),
        DOB: Joi.date().required(),
        // Unfortunately no supported phone number module exists
        MobileNumber: Joi.string().allow(null), // If the phone number is not set it will have no result.
        OKtoMail: Joi.number()
          .max(1)
          .required(),
        Postcode: Joi.string().required(),
        PreParkrunExerciseFrequency: Joi.number().required(),
        WheelchairAthlete: Joi.number()
          .max(1)
          .required(),
        eMailID: Joi.string()
          .email({ tlds: { allow: false } }) // TLD Validation has been disabled for improved version control, so that we don't have to build for browsers manually (and so keep a custom fork maintained)
          .required(),
        Sex: Joi.string() // ClientUser only as of Feb '20, see https://github.com/Prouser123/parkrun.js/issues/33
          .length(1)
          .required()
      })
      .required()
  }).required()
});

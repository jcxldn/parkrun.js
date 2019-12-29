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
        MobileNumber: Joi.string().required(),
        OKtoMail: Joi.number()
          .max(1)
          .required(),
        Postcode: Joi.string().required(),
        PreParkrunExerciseFrequency: Joi.number().required(),
        WheelchairAthlete: Joi.number()
          .max(1)
          .required(),
        eMailID: Joi.string()
          .email()
          .required()
      })
      .required()
  }).required()
});

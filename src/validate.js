const ValidationError = require("./errors/ParkrunValidationError");

const options = {
  stripUnknown: true,
  abortEarly: false
};

/**
 * @param data Data to validate against
 * @param {Joi} schema schema to use
 *
 * @throws {ParkrunValidationError} Validation error.
 */
module.exports = (data, schema) => {
  const res = schema.validate(data, options);
  if (res.error) {
    throw new ValidationError(res.error);
  } else {
    return res.value;
  }
};

/**
 * Error class for (Joi) Validation-related errors.
 *
 * e.g. when the API response was not what was expected.
 *
 * @extends {Error}
 */
class ParkrunValidationError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg;
    this.name = this.constructor.name;
  }
}

module.exports = ParkrunValidationError;

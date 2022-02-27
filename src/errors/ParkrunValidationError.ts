/**
 * Error class for (Joi) Validation-related errors.
 *
 * e.g. when the API response was not what was expected.
 *
 * @extends {Error}
 */
export class ParkrunValidationError extends Error {
  constructor(message) {
    super(message);
  }
};

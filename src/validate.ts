import { ParkrunValidationError } from "./errors";

const options = {
	stripUnknown: true,
	abortEarly: false,
};

/**
 * @param data Data to validate against
 * @param {Joi} schema schema to use
 *
 * @throws {ParkrunValidationError} Validation error.
 */
export const validate = (data: any, schema: any) => {
	const res = schema.validate(data, options);
	if (res.error) {
		throw new ParkrunValidationError("Error validating api response :: " + res.error);
	} else {
		return res.value;
	}
};

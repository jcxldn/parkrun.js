import { ParkrunValidationError } from "./errors";
import { ObjectSchema } from "joi";

const options = {
	stripUnknown: true,
	abortEarly: false,
};

/**
 * @param {object} data Data to validate against
 * @param {Schema} schema schema to use
 *
 * @throws {ParkrunValidationError} Validation error.
 */
export const validate = (data: object, schema: ObjectSchema) => {
	const res = schema.validate(data, options);
	if (res.error) {
		throw new ParkrunValidationError("Error validating api response :: " + res.error);
	} else {
		return res.value;
	}
};

import * as Joi from "joi";

/**
 * Joi Schema for Athlete (Expanded) data.
 */
export const AuthSchema = Joi.object({
	access_token: Joi.string().token().required(),
	refresh_token: Joi.string().token().required(),
	token_type: Joi.string().valid("bearer").required(),
	scope: Joi.string().valid("app").required(),
	expires_in: Joi.number().required(),
});

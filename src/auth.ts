const net = require("./classes/Net").getNonAuthed();

const Tokens = require("./classes/Tokens");

const SearchParams = require("./common/SearchParams");

const AuthError = require("./errors/ParkrunAuthError");
const UserPassError = require("./errors/ParkrunUserPassError");

const Validate = require("./validate");
const AuthSchema = require("./schemas/AuthSchema");

const auth = async (id, password) => {
	// ID checking here

	const params = new SearchParams([
		["username", id],
		["password", password],
		["scope", "app"],
		["grant_type", "password"],
	]);
	try {
		const res = await net.post("/user_auth.php", params.get(), {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});

		// HTTP Success, continue
		if (res.status == 200) {
			/*
			 * Validate the response data against a Joi Schema.
			 *
			 * Will throw a ParkrunValidationError if the check fails.
			 */
			Validate(res.data, AuthSchema);

			// Login successful, tokens recieved
			//return new Parkrun(new Tokens(res.data, res.headers.date));
			return new Tokens(res.data, res.headers.date);
		}
	} catch (error) {
		// Validation errors
		if (error.name == "ParkrunValidationError") throw error;

		// Response errors
		if (error.response != undefined) {
			// A request was made and the server responsed with a non 2xx status code.
			if (error.response.status == 400) {
				throw new UserPassError("invalid username or password!");
			}
		} else {
			console.error(error);
			throw new AuthError("unspecified error during auth flow");
		}
	}
};

module.exports = auth;

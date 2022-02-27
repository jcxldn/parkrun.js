import { Net } from "../classes/Net";
import { TokensData } from "../classes/TokensData";
import { ParkrunAuthError, ParkrunRefreshExpiredError } from "../errors";

const net = Net.getNonAuthed();

export const refreshToken = async (token: string) => {
	const params = new SearchParams([
		["refresh_token", token],
		["grant_type", "refresh_token"],
	]);

	try {
		const res = await net.post("/auth/refresh", params.get(), {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});

		// Check for no response data
		if (!res.data) {
			const err = new Error("server did not return any response data!");
			err.wasPkrun = true;
			throw err;
		}

		// Token refresh was successful, now we return a new Tokens class object.
		const output = res.data;
		output.refresh_token = refreshToken;
		return new TokensData(output, res.headers.date);
	} catch (err) {
		// Skip the error process if we defined one as such in the try block.
		// See 'no response data' error.
		if (err.wasPkrun) throw err;

		if (err.response.status == 400 && err.response.data.error == "invalid_grant") {
			// At this point, we either have an expired or invalid refresh token.

			if (err.response.data.error_description == "Refresh token has expired") {
				throw new ParkrunRefreshExpiredError("refresh token has expired");
			}

			if (err.response.data.error_description == "Invalid refresh token") {
				throw new ParkrunAuthError("invalid refresh token");
			}

			throw new Error("server returned http code 400, invalid grant");
		}
		throw new Error("unspecified error during token refresh");
	}
};

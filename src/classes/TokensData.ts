/**
 * Utility class representing an individual (access) token.
 * @internal
 */
export class TokensData {
	_access: string;
	_refresh: string;
	_type: string;
	_scope: string;
	_date_start: number;
	_date_end: number;

	constructor(auth_res, date_issued: string) {
		this._access = auth_res.access_token;
		this._refresh = auth_res.refresh_token;
		this._type = auth_res.token_type;
		this._scope = auth_res.scope;

		// Setup variables to determine if the token is still valid

		// Save the epoch of the start time
		this._date_start = new Date(date_issued).getTime() / 1000;
		this._date_end = this._date_start + parseInt(auth_res.expires_in);
	}
}

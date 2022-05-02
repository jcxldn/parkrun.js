/**
 * A class representing a parkrun country.
 */
export class Country {
	private _code: number;
	private _name: string;
	private _active: boolean;
	private _site_url: string;
	private _languageID: number;
	private _wiki_name: string;
	private _ccTLD: string;

	constructor(res, private readonly _core) {
		this._code = Number.parseInt(res.CountryCode);
		this._name = res.Country;
		this._active = !!new Boolean(res.Active);
		this._site_url = res.CountrySiteUrl;
		this._languageID = Number.parseInt(res.DefaultLanguageId);
		this._wiki_name = res.wikiCountryName;
		this._ccTLD = res.ccTLD;
	}

	/**
	 * Get an array of all the events in this country.
	 *
	 *
	 * @see (Borrows from {@link Parkrun.getAllEventsByCountry})
	 * @see Parkrun#getAllEvents
	 *
	 * @returns {Promise<Array<Event>>}
	 * @throws {@link ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getAllEvents() {
		return await this._core.getAllEventsByCountry(this._code);
	}

	/**
	 * Get an array with the names of all parkrun events in this country, in alphabetical order.
	 *
	 * @see (Borrows from {@link Parkrun.getAllEventNamesByCountry})
	 * @see Parkrun#getAllEventNames
	 *
	 * @returns {Promise<Array<String>>}
	 * @throws {@link ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getAllEventNames() {
		return await this._core.getAllEventNamesByCountry(this._code);
	}

	/**
	 * Get the country code for this country.
	 *
	 * @returns {Number} Country code.
	 */
	getCode() {
		return this._code;
	}

	/**
	 * Get the name for this country.
	 *
	 * @returns {String} Country name.
	 */
	getName() {
		return this._name;
	}

	/**
	 * Boolean describing weather the specified country is active or not.
	 *
	 * @returns {Boolean} country is active?
	 */
	getIsActive() {
		return this._active;
	}

	/**
	 * Get the site URL for this country.
	 *
	 * @returns {String} Site URL
	 * @example ```ts
	 * country.getSiteURL(); // 'www.parkrun.org.uk
	 * ```
	 */
	getSiteURL() {
		return this._site_url;
	}

	/**
	 * Get the Language ID for this country.
	 *
	 * @returns {Number} Language ID.
	 */
	getLanguageID() {
		return this._languageID;
	}

	/**
	 * Get the Wiki Name for this country.
	 *
	 * @returns {String} Wiki Name.
	 * @example ```ts
	 * country.getWikiName(); // 'UK'
	 * ```
	 */
	getWikiName() {
		return this._wiki_name;
	}

	/**
	 * Get the Country-Code Top Level Domain (ccTLD) for this country.
	 *
	 * @returns {String} ccTLD.
	 * @example ```ts
	 * country.getCCTLD(); // 'uk'
	 * ```
	 */
	getCCTLD() {
		return this._ccTLD;
	}
}

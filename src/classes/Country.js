/**
 * A class representing a parkrun country.
 *
 *
 * @borrows Parkrun#getAllEventsByCountry as getAllEvents
 */
class Country {
  constructor(res, core) {
    this._code = Number.parseInt(res.CountryCode);
    this._name = res.Country;
    this._active = new Boolean(res.Active);
    this._site_url = res.CountrySiteUrl;
    this._languageID = Number.parseInt(res.DefaultLanguageId);
    this._wiki_name = res.wikiCountryName;
    this._ccTLD = res.ccTLD;

    // The core object is the core of the Parkrun API.
    this._core = core;
  }

  /**
   * Get an array of all the events in this country.
   *
   *
   * @see Parkrun#getAllEventsByCountry()
   * @see Parkrun#getAllEvents()
   *
   * @returns {Promise<Array<Event>>}
   * @throws {ParkrunNetError} ParkrunJS Networking Error.
   */
  async getAllEvents() {
    const url = `/v1/countries/${this._code}/searchEvents`;
    return await this._core._getEventClassArrayOfAllEventsUsingURL(url);
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
   * @example country.getSiteURL(); // 'www.parkrun.org.uk'
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
   * @example country.getWikiName(); // 'UK'
   */
  getWikiName() {
    return this._wiki_name;
  }

  /**
   * Get the Country-Code Top Level Domain (ccTLD) for this country.
   *
   * @returns {String} ccTLD.
   * @example country.getCCTLD(); // 'uk'
   */
  getCCTLD() {
    return this._ccTLD;
  }
}

module.exports = Country;

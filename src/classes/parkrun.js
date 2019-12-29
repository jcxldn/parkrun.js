// TODO: Rename to 'Client'

/**
 * The main hub for interacting with the Parkrun API.
 */
class Parkrun {
  /**
   * Constructor from tokens.
   *
   * @param {Tokens} tokens
   */
  constructor(tokens) {
    this.tokens = tokens;
  }
}

module.exports = Parkrun;

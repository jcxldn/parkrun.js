/**
 * A class representing a news post for a parkrun event.
 */
class EventNewsPost {
  constructor(res) {
    this._event = Number.parseInt(res.EventNumber);
    this._id = Number.parseInt(res.ID);
    this._commentCount = Number.parseInt(res.NumberOfComments);
    this._authorName = res.author;
    this._authorAvatar = res.avatar;
    this._date = new Date(res.post_date);
    this._title = res.post_title;
  }

  /**
   * Get the parent event ID for this news post.
   *
   * @returns {Number} Event ID.
   */
  getEventID() {
    return this._event;
  }

  /**
   * Get the post ID of this object.
   *
   * @returns {Number} Post ID.
   */
  getID() {
    return this._id;
  }

  /**
   * Get the amount of comments for this news post.
   *
   * @returns {Number} Comment count.
   */
  getCommentCount() {
    return this._commentCount;
  }

  /**
   * Get the author's name for this news post.
   *
   * @returns {String} Author name.
   */
  getAuthorName() {
    return this._authorName;
  }

  /**
   * Get the author's avatar for this news post.
   *
   * @returns {String} Avatar URL.
   */
  getAuthorAvatarURL() {
    return this._authorAvatar;
  }

  /**
   * Get the post date for this news item.
   *
   * @returns {Date} Post date.
   */
  getDate() {
    return this._date;
  }

  /**
   * Get the post title for this news post.
   *
   * @returns {String} Post title.
   */
  getTitle() {
    return this._title;
  }
}

module.exports = EventNewsPost;

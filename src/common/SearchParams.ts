module.exports = class SearchParams {
  constructor(arr) {
    this._data = "";
    for (var i = 0, len = arr.length; i < len; i++) {
      if (i != 0) this._data += "&";
      this._data += `${encodeURIComponent(arr[i][0])}=${encodeURIComponent(
        arr[i][1]
      )}`;
    }
  }

  get() {
    return this._data;
  }
};

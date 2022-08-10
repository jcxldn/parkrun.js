/**
 * Utility class to construct a query string // search parameters
 * @internal
 */
export class SearchParams {
	private _data = "";

	constructor(arr: string[][]) {
		for (var i = 0, len = arr.length; i < len; i++) {
			if (i != 0) this._data += "&";
			this._data += `${encodeURIComponent(arr[i][0])}=${encodeURIComponent(arr[i][1])}`;
		}
	}

	get() {
		return this._data;
	}
}

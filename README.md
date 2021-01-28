# parkrun.js

![ci build status (master)](https://img.shields.io/github/workflow/status/Prouser123/parkrun.js/ci/master?label=tests&logo=github&logoColor=white)
![docs build status (master)](https://img.shields.io/github/workflow/status/Prouser123/parkrun.js/docs/master?label=docs&logo=github&logoColor=white)
![Codecov](https://img.shields.io/codecov/c/gh/prouser123/parkrun.js)
![node-current](https://img.shields.io/node/v/parkrun.js)
![Dist Size (Brotli)](<https://img.badgesize.io/prouser123/parkrun.js/gh-pages/parkrun.browser.min.js?compression=brotli&label=dist%20size%20(brotli)>)
![npm latest version](https://img.shields.io/npm/v/parkrun.js)

A JavaScript implementation of the Parkrun API gathered from reverse-engineering the official app.

## Installation

`npm i parkrun.js`

Or, for usage in a browser:

`<script src="https://cdn.jsdelivr.net/npm/parkrun.js"></script>`

<br>
<details>
<summary>Bleeding edge releases</summary>
<br>

Please note that these releases **will have bugs**, and are **not** meant for production use.

- via npm: `npm i prouser123/parkrun.js`

- or for use within a browser: `<script src="https://parkrun.js.org/parkrun.browser.min.js"></script>`

</details>

## FAQ

### Upstream API Limitations

These are limitations with all services using the official parkrun API.

- Freedom Runs can only be accessed for the current user

  - 401: `Attempt to access details for AthleteId which does not match user AthleteId`

## Acknowledgments

<a href="https://saucelabs.com" target="_blank"><img src="https://raw.githubusercontent.com/Prouser123/parkrun.js/master/.github/powered-by-saucelabs-red.svg?sanitize=true" height="100" /></a>

# parkrun.js

![Travis Tests](https://img.shields.io/travis/com/prouser123/parkrun.js?label=tests)
![Codecov](https://img.shields.io/codecov/c/gh/prouser123/parkrun.js)
![docs build status](https://img.shields.io/github/workflow/status/prouser123/parkrun.js/docs?label=docs)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FProuser123%2Fparkrun.js.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FProuser123%2Fparkrun.js?ref=badge_shield)

A JavaScript implementation of the Parkrun API gathered from reverse-engineering the official app.

## FAQ

### Upstream API Limitations

These are limitations with all services using the official parkrun API.

- Freedom Runs can only be accessed for the current user

  - 401: `Attempt to access details for AthleteId which does not match user AthleteId`

### Why is Node.js 8.10 the mininum?

We have several dependencies (as well as some code) that uses newer features, such as...

- async (`>=7.6`)
- spread syntax (`>8.5`)
- mocha 7 (chokidar, `>8.10`)

However, as of January 2020, Node.js 8.X is no longer supported for any use case, and so you should really upgrade anyway.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FProuser123%2Fparkrun.js.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FProuser123%2Fparkrun.js?ref=badge_large)
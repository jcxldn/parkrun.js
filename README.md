# parkrun.js

A JavaScript implementation of the Parkrun API gathered from reverse-engineering the official app.

## Upstream API Limitations

These are limitations with all services using the official parkrun API.

- Freedom Runs can only be accessed for the current user

  - 401: `Attempt to access details for AthleteId which does not match user AthleteId`

## Why is Node.js 8.10 the mininum?

We have several dependencies (as well as some code) that uses newer features, such as...

- spread syntax (`>8.5`)
- mocha 7 (chokidar, `>8.10`)

However, as of January 2020, Node.js 8.X is no longer supported for any use case, and so you should really upgrade anyway.

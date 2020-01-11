# parkrun.js
A JavaScript implementation of the Parkrun API gathered from reverse-engineering the official app. 


## Upstream API Limitations

These are limitations with all services using the official parkrun API.

- Freedom Runs can only be accessed for the current user

  - 401: `Attempt to access details for AthleteId which does not match user AthleteId`

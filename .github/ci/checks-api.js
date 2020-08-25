const { App } = require("@octokit/app");
const { request } = require("@octokit/request");

const octo = new App({
  id: 53420,
  privateKey: Buffer.from(process.env.GITHUB_PEM, "base64").toString(),
});
const jwt = octo.getSignedJsonWebToken();

async function makeCheck({ name, status, conclusion, title, summary }) {
  return await request("POST /repos/Prouser123/parkrun.js/check-runs", {
    name,
    head_sha: process.env.TRAVIS_COMMIT, // DYN
    status,
    conclusion, // DYN
    output: {
      title,
      summary,
    },
    headers: {
      authorization: `token ${await getInstallationToken()}`,
      accept: "application/vnd.github.antiope-preview+json",
    },
  });
}

async function getInstallationToken() {
  return (
    await request("POST /app/installations/6675355/access_tokens", {
      headers: {
        authorization: `Bearer ${jwt}`,
        accept: "application/vnd.github.machine-man-preview+json",
      },
    })
  ).data.token;
}

module.exports = { makeCheck };

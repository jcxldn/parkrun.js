const { createAppAuth } = require("@octokit/auth-app");
const { request } = require("@octokit/request");


export class ChecksApi {

  private auth: any;
  private authentication: any;
  private jwt: any;


  setup = async () => {
    this.auth = createAppAuth({
      id: 53420,
      privateKey: process.env.GITHUB_PEM.toString().replace(/\\n/g, "\n"),
    });

    this.authentication = await this.auth({ type: "app" })
    this.jwt = this.authentication.token
  };

  makeCheck = async ({ name, status, conclusion, title, summary }) => {
    return await request("POST /repos/Prouser123/parkrun.js/check-runs", {
      name,
      head_sha: process.env.GITHUB_SHA, // DYN
      status,
      conclusion, // DYN
      output: {
        title,
        summary,
      },
      headers: {
        authorization: `token ${await this.getInstallationToken()}`,
        accept: "application/vnd.github.antiope-preview+json",
      },
    });
  }


  private getInstallationToken = async () => {
    return (
      await request("POST /app/installations/6675355/access_tokens", {
        headers: {
          authorization: `Bearer ${this.jwt}`,
          accept: "application/vnd.github.machine-man-preview+json",
        },
      })
    ).data.token;
  }
}

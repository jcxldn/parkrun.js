const B2 = require("backblaze-b2");

const retry = require("promise-retry");

const { App } = require("@octokit/app");
const { request } = require("@octokit/request");

const fs = require("fs");
const path = require("path");

/**
 * Promise all
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 */
function promiseAllP(items, block) {
  var promises = [];
  items.forEach(function(item, index) {
    promises.push(
      (function(item, i) {
        return new Promise(function(resolve, reject) {
          return block.apply(this, [item, index, resolve, reject]);
        });
      })(item, index)
    );
  });
  return Promise.all(promises);
} //promiseAll

/**
 * read files
 * @param dirname string
 * @return Promise
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @see http://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object
 */
function readFiles(dirname) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, function(err, filenames) {
      if (err) return reject(err);
      promiseAllP(filenames, (filename, index, resolve, reject) => {
        fs.readFile(path.resolve(dirname, filename), "utf-8", function(
          err,
          content
        ) {
          if (err) return reject(err);
          return resolve({ filename: filename, contents: content });
        });
      })
        .then(results => {
          return resolve(results);
        })
        .catch(error => {
          return reject(error);
        });
    });
  });
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_KEY,
  // https://www.backblaze.com/blog/b2-503-500-server-error/
  retry: {
    retries: 5,
    retryDelay: function noDelay() {
      return 1000;
    } // 1 second -- ref: https://github.com/softonic/axios-retry/blob/40e3f0797b9ef9b6728dd4e7639b5ff0bd8644b9/es/index.js#L67
  }
});

const octo = new App({
  id: 53420,
  privateKey: Buffer.from(process.env.GITHUB_PEM, "base64").toString()
});
const jwt = octo.getSignedJsonWebToken();

async function uploadB2() {
  const output = [];

  await b2.authorize();

  const { uploadUrl, authorizationToken } = (
    await b2.getUploadUrl({
      bucketId: "78255b6afd71142360e20419"
    })
  ).data;

  const files = await readFiles(path.resolve(".ci_tmp/images"));

  console.log(`Loaded ${files.length} images.`);

  await asyncForEach(files, async file => {
    const data = JSON.parse(file.contents);

    const upload = await retry((retry, number) => {
      console.log(`Uploading to B2: ${file.filename} (attempt ${number})`);
      return b2
        .uploadFile({
          uploadUrl,
          uploadAuthToken: authorizationToken,
          fileName:
            "parkrunjs_/saucelabs_img/" +
            file.filename.replace(".json", ".png"),
          mime: "image/png",
          data: Buffer.from(
            data.image.replace(/^data:image\/png;base64,/, ""),
            "base64"
          )
        })
        .catch(err => {
          retry(err);
        });
    });

    console.log(
      "https://dl-f0.jcx.ovh/file/jcx-pub-dl/" + upload.data.fileName
    );
    console.log(file.filename.split(".")[0]); // ID
    console.log("Uploaded!");

    output.push(
      Object.assign(data, { image: undefined, id: file.filename.split(".")[0] })
    );
  });

  return output;
}

function createSubset(item) {
  return `<details>
<summary>${item.num_failed == 0 ? ":heavy_check_mark:" : ":x:"} ${
    item.browser
  }@${item.version} (${item.platform.toString().toLowerCase()})</summary>
<br>

:heavy_check_mark: **${item.num_passed}**

:x: **${item.num_failed}**

<br>

## Output

[Saucelabs Output](https://app.eu-central-1.saucelabs.com/tests/${item.id})

<img src="https://dl-f0.jcx.ovh/file/jcx-pub-dl/parkrunjs_/saucelabs_img/${
    item.id
  }.png"/>
</details>`;
}

async function OctokitCheck(arr, token, check_passing) {
  let summary = "";

  await asyncForEach(arr, item => {
    summary += createSubset(item);
  });

  await request("POST /repos/Prouser123/parkrun.js/check-runs", {
    name: "ci/web",
    head_sha: process.env.TRAVIS_COMMIT, // DYN
    status: "completed",
    conclusion: check_passing ? "success" : "failure", // DYN
    output: {
      title: "Saucelabs Results",
      summary
    },
    headers: {
      authorization: `token ${token}`,
      accept: "application/vnd.github.antiope-preview+json"
    }
  });
}

async function getInstallationToken() {
  return (
    await request("POST /app/installations/6675355/access_tokens", {
      headers: {
        authorization: `Bearer ${jwt}`,
        accept: "application/vnd.github.machine-man-preview+json"
      }
    })
  ).data.token;
}

// Main function
(async () => {
  const arr = await uploadB2();
  const check_passing = arr.every(i => i.num_failed == 0);
  await OctokitCheck(arr, await getInstallationToken(), check_passing);
})();

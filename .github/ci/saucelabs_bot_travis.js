const B2 = require("backblaze-b2");

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

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_KEY
});

b2.authorize().then(() => {
  b2.getUploadUrl({ bucketId: "78255b6afd71142360e20419" }).then(res => {
    readFiles(path.resolve(".ci_tmp/images")).then(files => {
      console.log(`Loaded ${files.length} images.`);
      files.forEach(file => {
        b2.uploadFile({
          uploadUrl: res.data.uploadUrl,
          uploadAuthToken: res.data.authorizationToken,
          fileName:
            "parkrunjs_/saucelabs_img/" + file.filename.replace(".b64", ""),
          mime: "image/png",
          data: Buffer.from(
            file.contents.replace(/^data:image\/png;base64,/, ""),
            "base64"
          )
        }).then(a => {
          console.log(
            "https://dl-f0.jcx.ovh/file/jcx-pub-dl/" + a.data.fileName
          );
          console.log(file.filename.split(".")[0]); // ID
          console.log("Uploaded!");
        });
      });
    });
  });
});

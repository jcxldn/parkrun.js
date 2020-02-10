// Originally from btoa.js (https://git.coolaj86.com/coolaj86/btoa.js), "btoa" on NPM.
// MIT / Apache-2.0 | Created by AJ ONeal <coolaj86@gmail.com> (https://coolaj86.com)

"use strict";

function btoa(str) {
  var buffer;

  if (str instanceof Buffer) {
    buffer = str;
  } else {
    buffer = Buffer.from(str.toString(), "binary");
  }

  return buffer.toString("base64");
}

global.btoa = btoa;

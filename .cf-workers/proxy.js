// Opts
const opts = {
  base_url: "api.parkrun.com",
  url_is_https: true, // Whether to use HTTPS protocol for upstream address.
  user_agent: "parkrun/1.2.7 CFNetwork/1121.2.2 Darwin/19.3.0"
};

// Replace texts.
const replace_dict = {
  $upstream: "$custom_domain",
  "//api.parkrun.com": ""
};

addEventListener("fetch", event => {
  event.respondWith(onEvent(event.request));
});

/**
 * Get the request body in it's native type / format.
 *
 * @param {Request} request
 * @returns {*} Body
 */
async function readRequestBody(request) {
  const { headers } = request;
  const contentType = headers.get("content-type");
  if (contentType.includes("application/json")) {
    const body = await request.json();
    return JSON.stringify(body);
  } else if (contentType.includes("application/text")) {
    const body = await request.text();
    return body;
  } else if (contentType.includes("text/html")) {
    const body = await request.text();
    return body;
  } else if (contentType.includes("form")) {
    const formData = await request.formData();
    let body = {};
    for (let entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    // Return as a proper URLSearch params object
    return new URLSearchParams(body).toString();
  } else {
    let myBlob = await request.blob();
    var objectURL = URL.createObjectURL(myBlob);
    return objectURL;
  }
}

async function onEvent(request) {
  if (request.method == "OPTIONS") {
    return new Response("ok, cf caught", {
      status: 200,
      headers: {
        "x-jcx-status": "proxy-bypass",
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "*",
        "access-control-expose-headers": "*"
      }
    });
  } else {
    return makeProxyRequest(request);
  }
}

async function makeProxyRequest(request) {
  const region = request.headers.get("cf-ipcountry").toUpperCase();
  const ip_address = request.headers.get("cf-connecting-ip");

  let response = null;
  let url = new URL(request.url);
  let url_host = url.host;

  url.protocol = opts.url_is_https ? "https:" : "http:";
  console.log("CHOSEN PROTOCOL: " + url.protocol);

  url.host = opts.base_url;

  let method = request.method;
  let request_headers = request.headers;
  console.log(request.headers.get("grant_type"));
  let new_request_headers = new Headers(request_headers);

  let requestHeaders = JSON.stringify([...request.headers], null, 2);
  console.log(requestHeaders);

  new_request_headers.set("Host", opts.base_url);
  new_request_headers.set("Referer", url.href);
  new_request_headers.set("User-Agent", opts.user_agent);
  new_request_headers.set("X-Served-By", "jcx/cf-workers/proxy");

  new_request_headers.delete("cookie");

  let original_response = await fetch(url.href, {
    method: method,
    headers: new_request_headers,
    body: method == "POST" ? await readRequestBody(request) : undefined
  });

  let original_response_clone = original_response.clone();
  let original_text = null;
  let response_headers = original_response.headers;
  let new_response_headers = new Headers(response_headers);
  let status = original_response.status;

  new_response_headers.set("access-control-allow-origin", "*");
  new_response_headers.set("access-control-allow-credentials", true);
  new_response_headers.set("x-jcx-sha", __SHA__);
  new_response_headers.delete("content-security-policy");
  new_response_headers.delete("content-security-policy-report-only");
  new_response_headers.delete("clear-site-data");

  let h = "x-jcx-fake";
  for (var pair of new_response_headers.entries()) {
    h += ", " + pair[0];
  }
  new_response_headers.set("access-control-expose-headers", h);

  const content_type = new_response_headers.get("content-type");
  if (content_type.includes("text/html") && content_type.includes("UTF-8")) {
    original_text = await replace_response_text(
      original_response_clone,
      opts.base_url,
      url_host
    );
  } else {
    original_text = original_response_clone.body;
  }

  response = new Response(original_text, {
    status,
    headers: new_response_headers
  });
  return response;
}

async function replace_response_text(response, upstream, host_name) {
  let text = await response.text();

  var i, j;
  for (i in replace_dict) {
    j = replace_dict[i];
    if (i == "$upstream") {
      i = upstream;
    } else if (i == "$custom_domain") {
      i = host_name;
    }

    if (j == "$upstream") {
      j = upstream;
    } else if (j == "$custom_domain") {
      j = host_name;
    }

    let re = new RegExp(i, "g");
    text = text.replace(re, j);
  }
  return text;
}

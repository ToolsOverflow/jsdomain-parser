const parseTld = require("./parseTld.js");
const parseUrl = require("./parseUrl.js");

function parse(url, options = {}) {
  try {
    const urlObject = parseUrl(url);

    if (
      urlObject.hostname.split(".").filter((i) => i.trim()).length <= 1 &&
      urlObject.hostname !== "localhost"
    ) {
      throw new Error(
        `Invalid domain name: "${urlObject.hostname}" is not a valid domain.`
      );
    }

    const tldData = parseTld(url, options);

    let domain = urlObject.hostname;
    const hostnameParts = urlObject.hostname.split(".");
    for (let i = hostnameParts.length - 1; i >= 0; i--) {
      const extended = hostnameParts.slice(i);

      if (extended.join(".") === tldData.name) {
        if (hostnameParts[i - 1]) {
          domain = hostnameParts[i - 1] + "." + extended.join(".");
        }

        break;
      }
    }

    const query = {};
    for (const [key, value] of urlObject.searchParams.entries()) {
      query[key] = value;
    }

    let urlData = {
      domain: domain,
      origin: urlObject.origin,
      protocol: urlObject.protocol,
      host: urlObject.host,
      hostname: urlObject.hostname,
      port: urlObject.port,
      pathname: urlObject.pathname,
      search: urlObject.search,
      hash: urlObject.hash,
      query,
    };

    // handle for protocols that aren't supported by URL constructor
    if (urlObject.origin === "null") {
      urlData.origin = urlObject.protocol + "//" + urlObject.hostname;
    }

    return {
      tld: tldData,
      url: urlData,
    };
  } catch (e) {
    throw new Error(`Invalid URL: ${e.message}`);
  }
}

module.exports = parse;

const parseTld = require("./src/parseTld.js");

function parse(url, options = {}) {
  try {
    if (!url.startsWith("http")) url = `http://${url}`;
    const urlObject = new URL(url);

    const tldData = parseTld(urlObject.hostname, options);

    let domain = urlObject.hostname;
    const hostnameParts = urlObject.hostname.split(".");
    for (let i = hostnameParts.length - 1; i >= 0; i--) {
      const extended = hostnameParts.slice(i);
      if (extended.join(".") === tldData.name) {
        domain = hostnameParts[i - 1] + "." + extended.join(".");
        break;
      }
    }

    const query = {};
    for (const [key, value] of urlObject.searchParams.entries()) {
      query[key] = value;
    }

    return {
      tld: tldData,
      url: {
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
      },
    };
  } catch (e) {
    throw new Error(`Invalid URL: ${e}`);
  }
}

module.exports = { parse, parseTld };

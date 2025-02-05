const parseUrl = require("./parseUrl");
const tlds = require("./tlds.json");

const parseTld = (url, options = {}) => {
  const {
    allowUnknown = false,
    allowPrivate = true,
    extendedTlds = [],
  } = options;

  if (!Array.isArray(extendedTlds)) {
    throw new Error("customTlds must be an array");
  }

  const { hostname } = parseUrl(url);

  // handle localhost as a special case
  if (hostname == "localhost" && allowPrivate)
    return { name: "localhost", length: 1, parts: ["localhost"] };

  const parts = hostname.split(".");

  const customTlds = extendedTlds.map((tld) => [tld, tld.split(".").length]);
  const icann = { ...tlds.icann, ...Object.fromEntries(customTlds) };
  const privateTlds = tlds.private;

  let detected = [];

  for (let p = parts.length - 1; p >= 0; p--) {
    const extended = parts.slice(p);
    const prevPart = parts[p - 1];

    if (icann[extended.join(".")] && prevPart !== undefined) {
      detected = extended;
    }

    if (allowPrivate) {
      if (privateTlds[extended.join(".")] && prevPart !== undefined) {
        detected = extended;
      }
    }
  }

  if (allowUnknown) {
    if (detected.length == 0) {
      detected = parts.slice(-1);
    }
  }

  // handle case where hostname is an IP address
  const isIP = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);

  if (detected.length == 0 && !isIP) {
    throw new Error(
      "Could not detect TLD. You can set allowUnknown to true for allowing unknown TLDs."
    );
  }

  return {
    name: detected.join("."),
    length: detected.length,
    parts: detected,
  };
};

module.exports = parseTld;

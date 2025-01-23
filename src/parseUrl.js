const parseUrl = (url) => {
  if (!url) throw new Error("Invalid domain name");

  const haveProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(url);
  if (!haveProtocol) url = `http://${url}`;
  const urlObject = new URL(url);

  // check for hostname validity
  if (urlObject.hostname.split(".").findIndex((it) => it.trim() == "") >= 0)
    throw new Error("Invalid domain name");

  return urlObject;
};

module.exports = parseUrl;

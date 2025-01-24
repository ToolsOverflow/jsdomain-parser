# JS Domain Parser

JS Domain Parser is a lightweight JavaScript library designed to parse and extract detailed information from URLs. It supports detecting TLDs (Top-Level Domains), handling private and unknown TLDs, and extending the TLD list with custom values.

## Features

- Extracts detailed URL components (protocol, domain, hostname, path, etc.).
- Detects TLDs using a comprehensive list of ICANN and private TLDs.
- Supports custom TLDs via configuration.
- Allows toggling support for private and unknown TLDs.
- Supports all protocols (e.g., `http`, `https`, `ssh`, `ftp`, `telnet`, etc.).

## Installation

```bash
npm install jsdomain-parser
```

---

or you can include `jsdomain-parser` directly in your project by adding the following `<script>` tag to your HTML file:

```html
<script src="./dist/jsdomain-parser.umd.min.js"></script>
```

This will expose the `jsDomainParser` global object in the browser.

## Usage

### Example 1: Basic Parsing

```javascript
import { parse } from "jsdomain-parser";

const url = "https://www.example.com/path?query=test#hash";
const result = parse(url);

console.log(result);
```

**Output:**

```json
{
  "tld": {
    "name": "com",
    "length": 1,
    "parts": ["com"]
  },
  "url": {
    "domain": "example.com",
    "origin": "https://www.example.com",
    "protocol": "https:",
    "host": "www.example.com",
    "hostname": "www.example.com",
    "port": "",
    "pathname": "/path",
    "search": "?query=test",
    "hash": "#hash",
    "query": {
      "query": "test"
    }
  }
}
```

### Example 2: Using Custom Options

```javascript
const url = "my.custom.tld";

const result = parse(url, {
  allowPrivate: true, // Enable private TLDs
  allowUnknown: false, // Disallow unknown TLDs
  extendedTlds: ["custom.tld", "tld"], // Add custom TLDs
});

console.log(result);
```

**Output:**

```json
{
  "tld": {
    "name": "custom.tld",
    "length": 2,
    "parts": ["custom", "tld"]
  },
  "url": {
    "domain": "my.custom.tld",
    "origin": "http://my.custom.tld",
    "protocol": "http:",
    "host": "my.custom.tld",
    "hostname": "my.custom.tld",
    "port": "",
    "pathname": "/",
    "search": "",
    "hash": "",
    "query": {}
  }
}
```

### Example 3: Error Handling

```javascript
try {
  const result = parse("invalid-url");
  console.log(result);
} catch (e) {
  console.error("Error:", e.message);
}
```

**Output:**

```
Error: Invalid URL: Invalid URL: Error: Could not detect TLD. You can set allowUnknown to true for allowing unknown TLDs.
```

## API Reference

### `parse(url, options = {})`

Parses a URL string and returns an object containing TLD and URL details.

- **`url`**: The URL to parse (string).
- **`options`** (object): Optional configurations:
  - `allowPrivate` (boolean): Allow private TLDs (default: `true`).
  - `allowUnknown` (boolean): Allow unknown TLDs (default: `false`).
  - `extendedTlds` (array): Array of custom TLDs to extend the list.

**Returns:**
An object with the following structure:

- `tld`: Details of the detected TLD.
  - `name`: The TLD name.
  - `length`: The number of parts in the TLD.
  - `parts`: An array of the TLD parts.
- `url`: Details of the parsed URL.
  - `domain`: The domain name.
  - `origin`: The full URL origin.
  - `protocol`: The protocol (e.g., `http:`).
  - `host`: The host.
  - `hostname`: The hostname.
  - `port`: The port (if any).
  - `pathname`: The path.
  - `search`: The query string.
  - `hash`: The hash fragment.
  - `query`: An object representation of query parameters.

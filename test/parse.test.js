const parse = require("../src/parse");

describe("JS Domain Parser Tests", () => {
  describe("1. General Domain Validation", () => {
    test("Valid domains with TLDs", () => {
      expect(parse("example.com")).toBeTruthy();
      expect(parse("subdomain.example.com")).toBeTruthy();
      expect(parse("example.co.uk")).toBeTruthy();
      expect(
        parse("example.custom", { extendedTlds: ["custom"] })
      ).toBeTruthy();
    });

    test("Domains without TLDs", () => {
      expect(() => parse("example")).toThrow();
      expect(parse("localhost").url.hostname).toBe("localhost");
      expect(() => parse("localhost", { allowPrivate: false })).toThrow();
    });

    test("Invalid domains", () => {
      expect(() => parse("invalid_domain")).toThrow();
      expect(() => parse("com.")).toThrow();
      expect(() => parse(".example.com")).toThrow();
      expect(() => parse("example..com")).toThrow();
    });
  });

  describe("2. Protocol Handling", () => {
    test("Supported protocols", () => {
      expect(parse("http://example.com").url.protocol).toBe("http:");
      expect(parse("https://example.com").url.protocol).toBe("https:");
      expect(parse("ftp://example.com").url.protocol).toBe("ftp:");
      expect(parse("ssh://example.com").url.protocol).toBe("ssh:");
      expect(parse("telnet://example.com").url.protocol).toBe("telnet:");
    });

    test("No protocol (assume http)", () => {
      expect(parse("example.com").url.protocol).toBe("http:");
      expect(parse("subdomain.example.com").url.protocol).toBe("http:");
    });

    test("Invalid protocol cases", () => {
      expect(() => parse("mailto:")).toThrow();
      expect(() => parse("ftp://")).toThrow();
    });

    test("Non-standard or custom protocols", () => {
      expect(
        parse("custom://example.com", { allowUnknown: true }).url.protocol
      ).toBe("custom:");
      expect(parse("telnet://192.168.1.1").url.protocol).toBe("telnet:");
    });
  });

  describe("3. Query Strings", () => {
    test("With query strings", () => {
      const result = parse("https://example.com?param=value");
      expect(result.url.query.param).toBe("value");
    });

    test("Encoded query strings", () => {
      const result = parse("https://example.com?param=%20value");
      expect(result.url.query.param).toBe(" value");
    });

    test("Empty query strings", () => {
      const result = parse("https://example.com?empty=&param=value");
      expect(result.url.query.empty).toBe("");
      expect(result.url.query.param).toBe("value");
    });
  });

  describe("4. Path Handling", () => {
    test("With paths", () => {
      expect(parse("https://example.com/path").url.pathname).toBe("/path");
      expect(parse("https://example.com/path/to/resource").url.pathname).toBe(
        "/path/to/resource"
      );
    });

    test("Edge cases for paths", () => {
      expect(parse("https://example.com//double-slash").url.pathname).toBe(
        "//double-slash"
      );
      expect(parse("https://example.com/path with spaces").url.pathname).toBe(
        "/path%20with%20spaces"
      );
    });
  });

  describe("5. Port Handling", () => {
    test("Standard ports", () => {
      expect(parse("http://example.com:80").url.port).toBe("");
      expect(parse("https://example.com:443").url.port).toBe("");
    });

    test("Non-standard ports", () => {
      expect(parse("http://example.com:8080").url.port).toBe("8080");
    });
  });

  describe("6. TLD Handling", () => {
    test("Known TLDs", () => {
      expect(parse("example.com").tld.name).toBe("com");
      expect(parse("example.org").tld.name).toBe("org");
    });

    test("Private TLDs", () => {
      expect(parse("example.github.io", { allowPrivate: true }).tld.name).toBe(
        "github.io"
      );
      expect(parse("example.github.io", { allowPrivate: false }).tld.name).toBe(
        "io"
      );
    });

    test("Unknown TLDs", () => {
      expect(parse("example.unknown", { allowUnknown: true }).tld.name).toBe(
        "unknown"
      );
      expect(() => parse("example.unknown", { allowUnknown: false })).toThrow();
    });
  });

  describe("8. Invalid Inputs", () => {
    test("Empty strings", () => {
      expect(() => parse("")).toThrow();
    });

    test("Improperly formatted URLs", () => {
      expect(() => parse("http://")).toThrow();
      expect(() => parse("https://.")).toThrow();
    });
  });

  describe("9. Nested Subdomains", () => {
    test("Deeply nested subdomains", () => {
      const result = parse("a.b.c.example.com");
      expect(result.url.hostname).toBe("a.b.c.example.com");
      expect(result.url.domain).toBe("example.com");
    });
  });

  describe("10. Mixed Case", () => {
    test("Case-insensitive domains", () => {
      expect(parse("HTTP://EXAMPLE.COM").url.hostname).toBe("example.com");
      expect(parse("https://Sub.Example.CoM").url.hostname).toBe(
        "sub.example.com"
      );
    });
  });
});

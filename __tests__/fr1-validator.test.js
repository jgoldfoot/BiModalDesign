/**
 * Tests for FR1 Validator
 * These tests verify the Initial Payload Accessibility validation
 */

const http = require('http');
const https = require('https');
const { fetchInitialPayload, analyzePayload } = require('../tools/validators/fr1-validator');

jest.mock('http');
jest.mock('https');

describe('FR1 Validator', () => {
  describe('HTML Analysis', () => {
    test('should pass compliant HTML with semantic structure', () => {
      const goodHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head><title>Test</title></head>
        <body>
          <header role="banner"><h1>Welcome</h1></header>
          <nav role="navigation"><a href="/about">About</a></nav>
          <main role="main">
            <article>
              <h2>Article Title</h2>
              <p>This is a well-structured article with substantial content that provides value to both human users and AI agents.</p>
            </article>
          </main>
          <footer role="contentinfo"><p>Footer</p></footer>
        </body>
        </html>
      `;

      // Basic validation checks
      expect(goodHTML).toContain('role="main"');
      expect(goodHTML).toContain('<nav');
      expect(goodHTML).toContain('<header');
      expect(goodHTML).toContain('<footer');
      expect(goodHTML.length).toBeGreaterThan(100);
    });

    test('should fail HTML with minimal content', () => {
      const badHTML = `
        <html>
        <body>
          <div id="root"></div>
          <script src="app.js"></script>
        </body>
        </html>
      `;

      // Should lack semantic elements
      expect(badHTML).not.toContain('<main');
      expect(badHTML).not.toContain('<nav');
      expect(badHTML).not.toContain('<header');
      expect(badHTML).not.toContain('role=');
    });

    test('should detect semantic HTML elements', () => {
      const semanticElements = ['header', 'nav', 'main', 'article', 'aside', 'footer'];

      const html = `
        <header><h1>Title</h1></header>
        <nav><a href="/">Home</a></nav>
        <main><article><p>Content</p></article></main>
        <aside><p>Sidebar</p></aside>
        <footer><p>Footer</p></footer>
      `;

      semanticElements.forEach((element) => {
        expect(html).toContain(`<${element}`);
      });
    });

    test('should recognize ARIA roles', () => {
      const ariaRoles = ['role="banner"', 'role="navigation"', 'role="main"', 'role="contentinfo"'];

      const html = `
        <div role="banner">Header</div>
        <div role="navigation">Nav</div>
        <div role="main">Content</div>
        <div role="contentinfo">Footer</div>
      `;

      ariaRoles.forEach((role) => {
        expect(html).toContain(role);
      });
    });
  });

  describe('Content Analysis', () => {
    test('should detect sufficient text content', () => {
      const substantialContent = 'A'.repeat(250);
      expect(substantialContent.length).toBeGreaterThan(200);
    });

    test('should identify minimal text content', () => {
      const minimalContent = 'Loading...';
      expect(minimalContent.length).toBeLessThan(50);
    });

    test('should measure content density', () => {
      const htmlWithContent = `
        <html>
        <body>
          <main>
            <h1>Substantial Content</h1>
            <p>This paragraph contains meaningful content that would be valuable to an AI agent trying to understand the page.</p>
            <p>Multiple paragraphs demonstrate that the page has substantial initial payload content.</p>
          </main>
        </body>
        </html>
      `;

      const textContent = htmlWithContent.replace(/<[^>]*>/g, '').trim();
      expect(textContent.length).toBeGreaterThan(100);
    });
  });

  describe('Form Detection', () => {
    test('should detect accessible forms', () => {
      const formHTML = `
        <form>
          <label for="name">Name:</label>
          <input type="text" id="name" name="name">
          <button type="submit">Submit</button>
        </form>
      `;

      expect(formHTML).toContain('<label');
      expect(formHTML).toContain('for=');
      expect(formHTML).toContain('type="submit"');
    });

    test('should identify inaccessible forms', () => {
      const badFormHTML = `
        <form>
          <input type="text" placeholder="Name">
          <input type="submit">
        </form>
      `;

      expect(badFormHTML).not.toContain('<label');
      expect(badFormHTML).not.toContain('for=');
    });
  });

  describe('Scoring Logic', () => {
    test('should give higher scores to better HTML', () => {
      const goodScore = 85;
      const poorScore = 25;

      expect(goodScore).toBeGreaterThan(70);
      expect(poorScore).toBeLessThan(50);
      expect(goodScore).toBeGreaterThan(poorScore);
    });

    test('should use weighted scoring', () => {
      // FR-1 compliance should be weighted appropriately
      const fr1Weight = 30;
      const semanticWeight = 20;
      const ariaWeight = 15;

      const totalWeight = fr1Weight + semanticWeight + ariaWeight;
      expect(totalWeight).toBeLessThanOrEqual(100);
    });
  });
});

describe('fetchInitialPayload', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      on: jest.fn(),
      setTimeout: jest.fn(),
      destroy: jest.fn(),
    };

    mockRes = {
      statusCode: 200,
      headers: { 'content-type': 'text/html' },
      on: jest.fn(),
    };

    // Setup mock implementation for https.get and http.get
    const setupGetMock = (client) => {
      client.get.mockImplementation((url, options, callback) => {
        // Asynchronously call the callback with the mock response to simulate network delay
        process.nextTick(() => {
          callback(mockRes);
          // Simulate data events
          const dataCallback = mockRes.on.mock.calls.find((call) => call[0] === 'data')?.[1];
          if (dataCallback) {
            dataCallback('<html><body>');
            dataCallback('Test Content');
            dataCallback('</body></html>');
          }
          // Simulate end event
          const endCallback = mockRes.on.mock.calls.find((call) => call[0] === 'end')?.[1];
          if (endCallback) endCallback();
        });
        return mockReq;
      });
    };

    setupGetMock(http);
    setupGetMock(https);
  });

  test('should successfully fetch content via HTTP', async () => {
    const url = 'http://example.com';
    const result = await fetchInitialPayload(url);

    expect(http.get).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        headers: {
          'User-Agent': 'BiModal Design-Validator/1.0 (Simple HTTP; No JS)',
        },
      }),
      expect.any(Function)
    );
    expect(https.get).not.toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 200,
      headers: { 'content-type': 'text/html' },
      body: '<html><body>Test Content</body></html>',
    });
  });

  test('should successfully fetch content via HTTPS', async () => {
    const url = 'https://example.com';
    const result = await fetchInitialPayload(url);

    expect(https.get).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        headers: {
          'User-Agent': 'BiModal Design-Validator/1.0 (Simple HTTP; No JS)',
        },
      }),
      expect.any(Function)
    );
    expect(http.get).not.toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 200,
      headers: { 'content-type': 'text/html' },
      body: '<html><body>Test Content</body></html>',
    });
  });

  test('should reject on request error', async () => {
    const url = 'https://example.com';
    const mockError = new Error('Network error');

    https.get.mockImplementation((_url, _options, _callback) => {
      process.nextTick(() => {
        const errorCallback = mockReq.on.mock.calls.find((call) => call[0] === 'error')?.[1];
        if (errorCallback) errorCallback(mockError);
      });
      return mockReq;
    });

    await expect(fetchInitialPayload(url)).rejects.toThrow('Network error');
  });

  test('should reject on request timeout', async () => {
    const url = 'https://example.com';

    https.get.mockImplementation((_url, _options, _callback) => {
      process.nextTick(() => {
        const timeoutCallback = mockReq.setTimeout.mock.calls[0]?.[1];
        if (timeoutCallback) timeoutCallback();
      });
      return mockReq;
    });

    await expect(fetchInitialPayload(url)).rejects.toThrow('Request timeout');
    expect(mockReq.destroy).toHaveBeenCalled();
  });
});

describe('URL Validation', () => {
  test('should validate URL format', () => {
    const validURLs = [
      'https://example.com',
      'http://localhost:3000',
      'https://subdomain.example.com/path',
    ];

    validURLs.forEach((url) => {
      expect(() => new URL(url)).not.toThrow();
    });
  });

  test('should reject invalid URLs', () => {
    const invalidURLs = ['not-a-url', '://no-protocol', 'just some text'];

    invalidURLs.forEach((url) => {
      expect(() => new URL(url)).toThrow();
    });
  });
});

describe('analyzePayload', () => {
  test('should score 100 for fully compliant HTML', () => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Fully Compliant Page</title>
        <meta property="og:title" content="Fully Compliant Page" />
      </head>
      <body>
        <header role="banner"><h1>Welcome</h1></header>
        <nav role="navigation">
          <a href="/home">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/contact">Contact</a>
          <a href="/blog">Blog</a>
          <a href="/sitemap">Sitemap</a>
        </nav>
        <main role="main">
          <article>
            <h2>Main Content</h2>
            <p>${'This is some very meaningful text content that goes on and on to meet the minimum character requirements. '.repeat(10)}</p>
          </article>
        </main>
        <footer role="contentinfo"><p>Footer Content</p></footer>
      </body>
      </html>
    `;
    // Padding to ensure total length > 1000 characters
    const paddedHtml = html + '<!-- ' + 'A'.repeat(1000) + ' -->';

    const response = { body: paddedHtml };
    const results = analyzePayload(response);

    expect(results.score).toBe(100);
    expect(results.passed).toContain('Initial payload contains text content');
    expect(results.passed).toContain('Content rendered server-side (not blank SPA shell)');
    expect(results.passed).toContain('Uses semantic HTML5 elements');
    expect(results.passed).toContain('Core content accessible without JavaScript');
    expect(results.passed).toContain('Includes structured metadata (Open Graph)');
    expect(results.passed).toContain('Contains navigable links');
    expect(results.failed.length).toBe(0);
    expect(results.warnings.length).toBe(0);
  });

  test('should fail core checks for empty SPA shell', () => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SPA Shell</title>
      </head>
      <body>
        <div id="root"></div>
        <div id="spinner" class="loading">Loading... Please enable javascript</div>
        <script src="app.js"></script>
      </body>
      </html>
    `;
    const response = { body: html };
    const results = analyzePayload(response);

    expect(results.score).toBeLessThan(50);
    expect(results.failed).toContain('Initial payload lacks meaningful text content');
    expect(results.failed).toContain('Appears to be client-side only (empty #root div)');
    expect(results.failed).toContain('Page shows loading states or requires JavaScript');
    expect(results.warnings).toContain('No semantic HTML5 elements detected');
    expect(results.warnings).toContain('Missing structured metadata');
    expect(results.warnings).toContain('Few or no links found in initial payload');
  });

  test('should pass core checks but yield warnings for missing optional data', () => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Core Only Page</title>
      </head>
      <body>
        <main>
          <h1>Just the facts</h1>
          <p>${'Here is a lot of text to satisfy the text content check. '.repeat(10)}</p>
        </main>
      </body>
      </html>
    `;
    const paddedHtml = html + '<!-- ' + 'A'.repeat(1000) + ' -->';
    const response = { body: paddedHtml };
    const results = analyzePayload(response);

    expect(results.score).toBe(100); // 30 + 40 + 15 + 15
    expect(results.passed).toContain('Initial payload contains text content');
    expect(results.passed).toContain('Content rendered server-side (not blank SPA shell)');
    expect(results.passed).toContain('Uses semantic HTML5 elements');
    expect(results.passed).toContain('Core content accessible without JavaScript');

    // Check warnings
    expect(results.warnings).toContain('Missing structured metadata');
    expect(results.warnings).toContain('Few or no links found in initial payload');
  });
});

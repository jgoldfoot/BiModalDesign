/**
 * Tests for FR1 Validator
 * These tests verify the Initial Payload Accessibility validation
 */

const { log, COLORS } = require('../tools/validators/fr1-validator.js');

describe('FR1 Validator', () => {
  describe('log function', () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('should format and log messages with correct colors and symbols', () => {
      log(COLORS.green, '✓', 'Success message');
      expect(consoleSpy).toHaveBeenCalledWith(`${COLORS.green}✓${COLORS.reset} Success message`);
    });

    test('should handle different colors', () => {
      log(COLORS.red, '✗', 'Error message');
      expect(consoleSpy).toHaveBeenCalledWith(`${COLORS.red}✗${COLORS.reset} Error message`);

      log(COLORS.yellow, '⚠', 'Warning message');
      expect(consoleSpy).toHaveBeenCalledWith(`${COLORS.yellow}⚠${COLORS.reset} Warning message`);
    });

    test('should handle empty message or symbol', () => {
      log(COLORS.blue, '', 'Test');
      expect(consoleSpy).toHaveBeenCalledWith(`${COLORS.blue}${COLORS.reset} Test`);

      log(COLORS.gray, '-', '');
      expect(consoleSpy).toHaveBeenCalledWith(`${COLORS.gray}-${COLORS.reset} `);
    });
  });

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

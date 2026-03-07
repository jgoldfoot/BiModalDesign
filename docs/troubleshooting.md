# BiModal Design Troubleshooting Guide

Common issues, solutions, and debugging techniques for BiModal Design
implementations.

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Agent Detection Issues](#agent-detection-issues)
3. [Content Accessibility Problems](#content-accessibility-problems)
4. [Performance Issues](#performance-issues)
5. [Framework-Specific Problems](#framework-specific-problems)
6. [SEO and Indexing Issues](#seo-and-indexing-issues)
7. [Accessibility Compliance Problems](#accessibility-compliance-problems)
8. [Debugging Tools and Techniques](#debugging-tools-and-techniques)
9. [Common Implementation Mistakes](#common-implementation-mistakes)
10. [Performance Optimization Issues](#performance-optimization-issues)

## Quick Diagnostics

### 5-Minute Health Check

Run these quick tests to identify major issues:

```bash
# Test 1: Basic content accessibility
curl -s "https://your-site.com/" | grep -E '<(main|nav|h1)'
# Expected: Should return semantic HTML elements

# Test 2: Agent detection
curl -H "User-Agent: GoogleBot/2.1" "https://your-site.com/"
# Expected: Should return content without JavaScript dependency

# Test 3: Structured data presence
curl -s "https://your-site.com/" | grep "application/ld+json"
# Expected: Should find structured data scripts

# Test 4: Agent attributes
curl -s "https://your-site.com/" | grep "data-agent-"
# Expected: Should find BiModal Design attributes

# Test 5: Performance check
curl -w "@curl-format.txt" -o /dev/null -s "https://your-site.com/"
# Expected: Time total should be < 2 seconds for agents
```

### Automated Diagnostic Script

```javascript
// diagnostic.js - Run this in browser console
function runBiModal DesignDiagnostic() {
  const results = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    issues: [],
    warnings: [],
    passed: [],
  };

  // Check 1: Semantic structure
  const semanticElements = [
    'main',
    'nav',
    'header',
    'footer',
    'article',
    'section',
  ];
  const foundElements = semanticElements.filter((tag) =>
    document.querySelector(tag)
  );

  if (foundElements.length >= 3) {
    results.passed.push('✅ Semantic HTML structure present');
  } else {
    results.issues.push(
      '❌ Missing semantic HTML elements. Found: ' + foundElements.join(', ')
    );
  }

  // Check 2: Agent attributes
  const agentComponents = document.querySelectorAll('[data-agent-component]');
  const agentActions = document.querySelectorAll('[data-agent-action]');

  if (agentComponents.length > 0 && agentActions.length > 0) {
    results.passed.push('✅ Agent attributes present');
  } else {
    results.issues.push('❌ Missing BiModal Design attributes');
  }

  // Check 3: Forms accessibility
  const forms = document.querySelectorAll('form');
  if (forms.length > 0) {
    const fieldsets = document.querySelectorAll('fieldset');
    const labels = document.querySelectorAll('label[for]');

    if (fieldsets.length > 0 && labels.length > 0) {
      results.passed.push('✅ Forms have proper accessibility structure');
    } else {
      results.warnings.push('⚠️ Forms may lack proper accessibility structure');
    }
  }

  // Check 4: Navigation
  const nav = document.querySelector('nav[role="navigation"]');
  if (nav) {
    results.passed.push('✅ Accessible navigation present');
  } else {
    results.issues.push('❌ Missing accessible navigation');
  }

  // Check 5: Structured data
  const structuredData = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  if (structuredData.length > 0) {
    results.passed.push('✅ Structured data present');
  } else {
    results.warnings.push('⚠️ No structured data found');
  }

  console.log('BiModal Design Diagnostic Results:', results);
  return results;
}

// Run diagnostic
runBiModal DesignDiagnostic();
```

## Agent Detection Issues

### Problem: Agents Not Being Detected

**Symptoms:**

- No agent-specific styling applied
- All users getting same experience
- Analytics showing no agent visits

**Common Causes:**

1. **Missing User-Agent Detection**

```javascript
// ❌ Wrong - Not checking user agent
function detectAgent() {
  return false; // Always returns false
}

// ✅ Correct - Proper user agent checking
function detectAgent() {
  const userAgent = navigator.userAgent || '';
  return /bot|crawler|spider/i.test(userAgent);
}
```

2. **Server-Side Detection Issues**

```javascript
// ❌ Wrong - Missing header check
app.use((req, res, next) => {
  req.isAgent = false; // Never detects agents
  next();
});

// ✅ Correct - Proper header detection
app.use((req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  req.isAgent = /bot|crawler|spider/i.test(userAgent);
  next();
});
```

**Solutions:**

1. **Verify Detection Logic**

```javascript
// Test your detection function
const testUserAgents = [
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'curl/7.68.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
];

testUserAgents.forEach((ua) => {
  console.log(`${ua}: ${detectAgent(ua) ? 'AGENT' : 'HUMAN'}`);
});
```

2. **Add Debug Logging**

```javascript
function detectAgent(userAgent = navigator.userAgent) {
  console.log('Detecting agent for:', userAgent);

  const patterns = [/bot/i, /crawler/i, /spider/i];
  const isAgent = patterns.some((pattern) => pattern.test(userAgent));

  console.log('Agent detected:', isAgent);
  return isAgent;
}
```

### Problem: False Positives/Negatives

**Symptoms:**

- Human users getting agent experience
- Agents getting human experience
- Inconsistent detection results

**Solutions:**

1. **Improve Pattern Specificity**

```javascript
// ❌ Too broad - catches human browsers
const patterns = [/chrome/i, /safari/i];

// ✅ More specific - targets actual agents
const patterns = [
  /googlebot/i,
  /bingbot/i,
  /facebookexternalhit/i,
  /headless/i,
];
```

2. **Add Confidence Scoring**

```javascript
function detectAgentWithConfidence(userAgent) {
  const highConfidence = [/googlebot/i, /bingbot/i];
  const mediumConfidence = [/bot/i, /crawler/i];

  for (const pattern of highConfidence) {
    if (pattern.test(userAgent)) {
      return { isAgent: true, confidence: 0.95 };
    }
  }

  for (const pattern of mediumConfidence) {
    if (pattern.test(userAgent)) {
      return { isAgent: true, confidence: 0.7 };
    }
  }

  return { isAgent: false, confidence: 0.9 };
}
```

## Content Accessibility Problems

### Problem: Empty Content for Agents

**Symptoms:**

- Agents receive blank pages
- Content requires JavaScript to load
- Search engines not indexing content

**Common Causes:**

1. **Client-Side Only Rendering**

```javascript
// ❌ Wrong - Content only available after JS execution
function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return <div>{data.content}</div>;
}
```

2. **Missing SSR Implementation**

```html
<!-- ❌ Wrong - Empty HTML shell -->
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/app.js"></script>
  </body>
</html>
```

**Solutions:**

1. **Implement Server-Side Rendering**

```javascript
// ✅ Correct - SSR with data fetching
export async function getServerSideProps() {
  const data = await fetchData();

  return {
    props: { data },
  };
}

function App({ data }) {
  return (
    <div data-agent-component="main-content">
      <h1 data-agent-content="page-title">{data.title}</h1>
      <p data-agent-content="page-description">{data.description}</p>
    </div>
  );
}
```

2. **Add Meaningful Fallback Content**

```html
<!-- ✅ Correct - Content available without JS -->
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <div id="root">
      <main role="main" data-agent-component="main-content">
        <h1 data-agent-content="page-title">Welcome to My App</h1>
        <p data-agent-content="page-description">
          Discover our products and services designed for everyone.
        </p>
        <nav data-agent-component="navigation">
          <a href="/products" data-agent-action="view-products">Products</a>
          <a href="/contact" data-agent-action="get-support">Contact</a>
        </nav>
      </main>
    </div>
    <script src="/app.js"></script>
  </body>
</html>
```

### Problem: Missing Agent Attributes

**Symptoms:**

- Agents struggle to understand page structure
- Low interaction success rates
- Poor analytics data

**Solutions:**

1. **Audit Existing Markup**

```javascript
// Audit script - run in browser console
function auditAgentAttributes() {
  const components = document.querySelectorAll('[data-agent-component]');
  const actions = document.querySelectorAll('[data-agent-action]');
  const content = document.querySelectorAll('[data-agent-content]');

  console.log('Agent Components:', components.length);
  console.log('Agent Actions:', actions.length);
  console.log('Agent Content:', content.length);

  // Check for missing attributes on interactive elements
  const buttons = document.querySelectorAll('button:not([data-agent-action])');
  const links = document.querySelectorAll('a:not([data-agent-action])');

  if (buttons.length > 0) {
    console.warn('Buttons missing agent actions:', buttons.length);
  }

  if (links.length > 0) {
    console.warn('Links missing agent actions:', links.length);
  }
}

auditAgentAttributes();
```

2. **Systematic Attribute Addition**

```javascript
// Add missing attributes programmatically
function enhanceAgentAttributes() {
  // Enhance buttons
  document
    .querySelectorAll('button:not([data-agent-action])')
    .forEach((button) => {
      const text = button.textContent.toLowerCase();

      if (text.includes('submit')) {
        button.setAttribute('data-agent-action', 'submit-form');
      } else if (text.includes('search')) {
        button.setAttribute('data-agent-action', 'perform-search');
      } else {
        button.setAttribute('data-agent-action', 'button-click');
      }
    });

  // Enhance navigation links
  document
    .querySelectorAll('nav a:not([data-agent-action])')
    .forEach((link) => {
      const href = link.getAttribute('href');

      if (href === '/') {
        link.setAttribute('data-agent-action', 'go-home');
      } else if (href.includes('product')) {
        link.setAttribute('data-agent-action', 'view-products');
      } else if (href.includes('contact')) {
        link.setAttribute('data-agent-action', 'get-support');
      } else {
        link.setAttribute('data-agent-action', 'navigate');
      }
    });
}

enhanceAgentAttributes();
```

## Performance Issues

### Problem: Slow Loading for Agents

**Symptoms:**

- High Time to First Byte (TTFB)
- Agents timing out
- Poor Core Web Vitals scores

**Common Causes:**

1. **Unnecessary JavaScript Execution**

```javascript
// ❌ Wrong - Loading heavy JS for agents
if (isAgent) {
  // Still loading full React bundle
  return <ComplexSPAComponent />;
}
```

2. **Unoptimized Images and Assets**

```html
<!-- ❌ Wrong - Large unoptimized images -->
<img src="/hero-image-4k.jpg" alt="Hero image" />
```

**Solutions:**

1. **Agent-Specific Optimizations**

```javascript
// ✅ Correct - Lightweight version for agents
if (isAgent) {
  return (
    <StaticContent
      title={data.title}
      description={data.description}
      structured={true}
    />
  );
}

return <FullInteractiveComponent data={data} />;
```

2. **Conditional Asset Loading**

```html
<!-- ✅ Correct - Optimized images for agents -->
<img
  src="/hero-image-optimized.jpg"
  alt="Hero image"
  width="800"
  height="400"
  loading="lazy"
/>
```

### Problem: Cache Issues for Agents

**Symptoms:**

- Agents receiving stale content
- Inconsistent responses
- Cache misses

**Solutions:**

1. **Agent-Aware Caching**

```javascript
// Express.js cache configuration
app.use((req, res, next) => {
  if (req.isAgent) {
    // Cache static content for agents
    res.set('Cache-Control', 'public, max-age=3600');
  } else {
    // No cache for dynamic human content
    res.set('Cache-Control', 'no-cache');
  }
  next();
});
```

2. **Vary Header Implementation**

```javascript
// Ensure proper cache variation
app.use((req, res, next) => {
  res.set('Vary', 'User-Agent');
  next();
});
```

## Framework-Specific Problems

### React Issues

**Problem: Hydration Mismatches**

**Symptoms:**

- Console warnings about hydration
- Different content on server vs client
- Flash of incorrect content

**Solutions:**

1. **Consistent Rendering**

```javascript
// ❌ Wrong - Different content on server/client
function Component() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <div>{isClient ? 'Client content' : 'Server content'}</div>;
}

// ✅ Correct - Consistent rendering
function Component({ isAgent }) {
  return (
    <div data-agent-detected={isAgent}>
      {isAgent ? <StaticContent /> : <InteractiveContent />}
    </div>
  );
}
```

2. **Proper SSR Setup**

```javascript
// pages/_app.js
function MyApp({ Component, pageProps, agentInfo }) {
  return (
    <AgentProvider agentInfo={agentInfo}>
      <Component {...pageProps} />
    </AgentProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const agentInfo = detectServerSideAgent(appContext.ctx.req);
  return { agentInfo };
};
```

### Vue/Nuxt Issues

**Problem: Client-Side Navigation Breaking Agent Experience**

**Solutions:**

1. **Agent-Aware Router Configuration**

```javascript
// nuxt.config.js
export default {
  router: {
    middleware: 'agent-detection'
  }
};

// middleware/agent-detection.js
export default function ({ req, redirect, route }) {
  const userAgent = process.server ? req.headers['user-agent'] : navigator.userAgent;
  const isAgent = /bot|crawler|spider/i.test(userAgent);

  if (isAgent && route.path.includes('?')) {
    // Redirect to clean URLs for agents
    return redirect(route.path.split('?')[0]);
  }
}
```

### Angular Issues

**Problem: Zone.js Conflicts with Agent Detection**

**Solutions:**

1. **Proper Zone Configuration**

```typescript
// main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Detect agent before Angular bootstrap
const isAgent = /bot|crawler|spider/i.test(navigator.userAgent);

if (isAgent) {
  // Disable unnecessary Zone.js features for agents
  (window as any).__Zone_disable_requestAnimationFrame = true;
  (window as any).__Zone_disable_on_property = true;
}

platformBrowserDynamic().bootstrapModule(AppModule);
```

## SEO and Indexing Issues

### Problem: Content Not Being Indexed

**Symptoms:**

- Pages missing from search results
- Low organic traffic
- Search console errors

**Diagnostic Steps:**

1. **Test with Search Console**

```bash
# Use Google Search Console URL Inspection Tool
# Check "Live Test" to see how Googlebot renders your page
```

2. **Manual Googlebot Simulation**

```bash
curl -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
     -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
     "https://your-site.com/"
```

**Solutions:**

1. **Verify Robots.txt**

```txt
# robots.txt
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://your-site.com/sitemap.xml
```

2. **Add Structured Data**

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Page Title",
    "description": "Page description",
    "url": "https://your-site.com/page"
  }
</script>
```

### Problem: Duplicate Content Issues

**Symptoms:**

- Multiple URLs serving same content
- Canonical URL warnings
- Diluted search rankings

**Solutions:**

1. **Implement Canonical URLs**

```html
<link rel="canonical" href="https://your-site.com/canonical-url" />
```

2. **Redirect Duplicate URLs**

```javascript
// Express.js redirect handling
app.get(['/products/', '/products/index.html'], (req, res) => {
  res.redirect(301, '/products');
});
```

## Accessibility Compliance Problems

### Problem: WCAG Compliance Failures

**Symptoms:**

- Automated accessibility testing failures
- Screen reader compatibility issues
- Keyboard navigation problems

**Common Issues and Solutions:**

1. **Missing Alt Text**

```html
<!-- ❌ Wrong -->
<img src="/product.jpg" />

<!-- ✅ Correct -->
<img src="/product.jpg" alt="Wireless Bluetooth Headphones - Black" />
```

2. **Improper Heading Hierarchy**

```html
<!-- ❌ Wrong - Skipped heading level -->
<h1>Main Title</h1>
<h3>Subsection</h3>

<!-- ✅ Correct - Proper hierarchy -->
<h1>Main Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
```

3. **Missing Form Labels**

```html
<!-- ❌ Wrong - No label association -->
<input type="email" placeholder="Email" />

<!-- ✅ Correct - Proper labeling -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email" required />
```

### Problem: Agent-Specific Accessibility Issues

**Solutions:**

1. **Enhanced ARIA for Agents**

```html
<nav
  role="navigation"
  aria-label="Main navigation"
  data-agent-component="navigation"
>
  <ul role="list">
    <li>
      <a
        href="/products"
        data-agent-action="view-products"
        aria-describedby="products-desc"
      >
        Products
      </a>
      <span id="products-desc" class="sr-only">
        Browse our complete product catalog
      </span>
    </li>
  </ul>
</nav>
```

2. **Skip Links for Agents**

```html
<a href="#main-content" class="skip-link" data-agent-action="skip-to-content">
  Skip to main content
</a>
```

## Debugging Tools and Techniques

### Browser DevTools Debugging

1. **Network Tab Analysis**

```javascript
// Check for agent-specific responses
// Look for X-Agent-Detected headers
// Verify different content for different user agents
```

2. **Console Debugging**

```javascript
// Add to your page for debugging
window.debugBiModal Design = function () {
  const agentComponents = document.querySelectorAll('[data-agent-component]');
  const agentActions = document.querySelectorAll('[data-agent-action]');
  const agentContent = document.querySelectorAll('[data-agent-content]');

  console.group('BiModal Design Debug Info');
  console.log('Components:', agentComponents.length);
  console.log('Actions:', agentActions.length);
  console.log('Content labels:', agentContent.length);
  console.log('User Agent:', navigator.userAgent);
  console.log('Detected as agent:', window.isAgent || false);
  console.groupEnd();

  return {
    components: agentComponents,
    actions: agentActions,
    content: agentContent,
  };
};
```

### Command Line Testing

1. **Multi-Agent Testing Script**

```bash
#!/bin/bash
# test-agents.sh

AGENTS=(
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
  "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
  "curl/7.68.0"
  "facebookexternalhit/1.1"
)

URL="https://your-site.com"

for agent in "${AGENTS[@]}"; do
  echo "Testing with: $agent"
  curl -H "User-Agent: $agent" -s "$URL" | head -20
  echo "---"
done
```

2. **Performance Testing**

```bash
# Test loading speed for agents
curl -w "@curl-format.txt" -o /dev/null -s \
  -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1)" \
  "https://your-site.com/"
```

### Automated Testing Setup

1. **Playwright Agent Testing**

```javascript
// tests/agent-compatibility.spec.js
const { test, expect } = require('@playwright/test');

const agentUserAgents = {
  googlebot: 'Mozilla/5.0 (compatible; Googlebot/2.1)',
  curl: 'curl/7.68.0',
};

Object.entries(agentUserAgents).forEach(([name, userAgent]) => {
  test(`${name} compatibility`, async ({ page }) => {
    await page.setUserAgent(userAgent);
    await page.goto('/');

    // Verify content is accessible
    const mainContent = await page.textContent('main');
    expect(mainContent.length).toBeGreaterThan(100);

    // Verify agent attributes
    const agentComponents = await page.$$('[data-agent-component]');
    expect(agentComponents.length).toBeGreaterThan(0);
  });
});
```

## Common Implementation Mistakes

### Mistake 1: Over-Engineering Agent Detection

**Problem:**

```javascript
// ❌ Too complex - Hard to maintain
function detectAgent(userAgent) {
  const ml_model = loadTensorFlowModel();
  const features = extractUserAgentFeatures(userAgent);
  const prediction = ml_model.predict(features);
  return prediction > 0.8;
}
```

**Solution:**

```javascript
// ✅ Simple and effective
function detectAgent(userAgent) {
  const agentPatterns = [
    /googlebot/i,
    /bingbot/i,
    /facebookexternalhit/i,
    /bot/i,
    /crawler/i,
    /spider/i,
  ];
  return agentPatterns.some((pattern) => pattern.test(userAgent));
}
```

### Mistake 2: Ignoring Human UX Impact

**Problem:**

```javascript
// ❌ Breaks experience for humans
if (isAgent) {
  // Remove all styling and interactions
  return <PlainTextVersion />;
}
```

**Solution:**

```javascript
// ✅ Maintains quality for both
if (isAgent) {
  return <OptimizedButUsableVersion />;
}
return <FullInteractiveVersion />;
```

### Mistake 3: Inconsistent Implementation

**Problem:**

- Some pages have agent optimization
- Others don't
- Mixed attribute naming

**Solution:**

```javascript
// Create consistent implementation guidelines
const AGENT_STANDARDS = {
  components: {
    navigation: 'data-agent-component="navigation"',
    productList: 'data-agent-component="product-list"',
    form: 'data-agent-component="form"',
  },
  actions: {
    navigate: 'data-agent-action="navigate"',
    submit: 'data-agent-action="submit-form"',
    purchase: 'data-agent-action="add-to-cart"',
  },
};
```

## Performance Optimization Issues

### Problem: Memory Leaks in Agent Detection

**Symptoms:**

- Increasing memory usage over time
- Browser slowdown
- Page crashes

**Causes and Solutions:**

1. **Event Listener Cleanup**

```javascript
// ❌ Wrong - Memory leak
function setupAgentDetection() {
  window.addEventListener('resize', updateAgentLayout);
  // Never removed!
}

// ✅ Correct - Proper cleanup
function setupAgentDetection() {
  function handleResize() {
    updateAgentLayout();
  }

  window.addEventListener('resize', handleResize);

  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}
```

2. **Observer Cleanup**

```javascript
// ✅ Proper MutationObserver cleanup
function startObserving() {
  const observer = new MutationObserver(handleMutations);
  observer.observe(document.body, { childList: true, subtree: true });

  // Return cleanup function
  return () => observer.disconnect();
}
```

### Problem: Excessive DOM Manipulation

**Solutions:**

1. **Batch DOM Updates**

```javascript
// ❌ Wrong - Multiple reflows
elements.forEach((el) => {
  el.setAttribute('data-agent-component', 'item');
  el.style.display = 'block';
  el.classList.add('agent-optimized');
});

// ✅ Correct - Batched updates
const fragment = document.createDocumentFragment();
elements.forEach((el) => {
  const clone = el.cloneNode(true);
  clone.setAttribute('data-agent-component', 'item');
  clone.style.display = 'block';
  clone.classList.add('agent-optimized');
  fragment.appendChild(clone);
});
document.body.appendChild(fragment);
```

## Emergency Fixes

### Quick Disable Agent Features

If BiModal Design implementation is causing issues in production:

```javascript
// Emergency disable - Add to head of page
window.BIMODAL_DESIGN_DISABLED = true;

// Update your detection code
function detectAgent() {
  if (window.BIMODAL_DESIGN_DISABLED) return false;
  // ... normal detection logic
}
```

### Rollback to Basic Implementation

```html
<!-- Minimal BiModal Design implementation -->
<html>
  <head>
    <title>Site Title</title>
    <meta name="description" content="Site description" />
  </head>
  <body>
    <nav role="navigation">
      <a href="/">Home</a>
      <a href="/products">Products</a>
      <a href="/contact">Contact</a>
    </nav>

    <main role="main">
      <h1>Page Title</h1>
      <p>Page content accessible without JavaScript</p>
    </main>
  </body>
</html>
```

## Getting Help

### Community Resources

- **GitHub Issues**: Report bugs and get help from maintainers
- **Documentation**: Check latest docs for updates and examples
- **Stack Overflow**: Tag questions with `bimodal-design` and `accessibility`

### Professional Support

For enterprise implementations requiring guaranteed uptime and performance:

- Code review services
- Implementation consulting
- Performance optimization
- Compliance auditing

### Useful External Tools

1. **Testing Tools**
   - Lighthouse CI for performance
   - axe-core for accessibility
   - Wave for manual accessibility testing

2. **Monitoring Tools**
   - Google Search Console for SEO
   - Core Web Vitals monitoring
   - Uptime monitoring with agent simulation

3. **Debug Tools**
   - Browser DevTools
   - Postman for API testing
   - curl for command-line testing

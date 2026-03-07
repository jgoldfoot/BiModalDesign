# BiModal Design API Reference

Technical specifications and reference documentation for implementing BiModal
Design patterns in web applications.

## Table of Contents

1. [HTML Attributes Reference](#html-attributes-reference)
2. [Structured Data Schemas](#structured-data-schemas)
3. [HTTP Headers and Meta Tags](#http-headers-and-meta-tags)
4. [JavaScript Detection API](#javascript-detection-api)
5. [CSS Classes and Selectors](#css-classes-and-selectors)
6. [Server-Side Implementation](#server-side-implementation)
7. [Testing and Validation APIs](#testing-and-validation-apis)
8. [Framework-Specific Integrations](#framework-specific-integrations)

## HTML Attributes Reference

### Core Agent Attributes

All BiModal Design attributes use the `data-agent-*` namespace to ensure
compatibility and avoid conflicts.

#### Page-Level Attributes

```html
<!-- Document root attributes -->
<html
  data-agent-framework="react|vue|angular|astro|next|nuxt"
  data-agent-version="major.minor.patch"
  data-agent-context="detected|unknown"
  data-agent-mode="ssr|ssg|csr|hybrid"
></html>
```

**Attribute Specifications:**

| Attribute              | Required | Values                                                       | Description                           |
| ---------------------- | -------- | ------------------------------------------------------------ | ------------------------------------- |
| `data-agent-framework` | No       | `react`, `vue`, `angular`, `astro`, `next`, `nuxt`, `custom` | Framework used for implementation     |
| `data-agent-version`   | No       | Semantic version string                                      | BiModal Design implementation version |
| `data-agent-context`   | No       | `detected`, `unknown`                                        | Whether agent was detected            |
| `data-agent-mode`      | No       | `ssr`, `ssg`, `csr`, `hybrid`                                | Rendering strategy used               |

#### Page Content Attributes

```html
<!-- Page identification -->
<body
  data-agent-page="home|products|contact|article|dashboard"
  data-agent-intent="browse|search|purchase|support|read"
  data-agent-content-type="product-catalog|article|form|dashboard"
></body>
```

**Page Type Values:**

- `home` - Landing/homepage
- `products` - Product catalog or listing
- `contact` - Contact or support page
- `article` - Content article or blog post
- `dashboard` - User dashboard or admin panel
- `checkout` - Purchase or payment flow
- `search` - Search results page
- `profile` - User profile or account page

**Intent Values:**

- `browse` - Casual browsing behavior
- `search` - Specific search intent
- `purchase` - Commercial transaction intent
- `support` - Help or support seeking
- `read` - Content consumption
- `manage` - Account or data management

### Component Attributes

#### Navigation Components

```html
<!-- Primary navigation -->
<nav
  data-agent-component="navigation"
  data-agent-nav-type="primary|secondary|breadcrumb|footer"
  role="navigation"
  aria-label="Main navigation"
>
  <a
    href="/products"
    data-agent-action="view-products"
    data-agent-nav-target="products"
  >
    Products
  </a>
</nav>
```

**Navigation Component Specification:**

| Attribute               | Required | Values                                         | Description                 |
| ----------------------- | -------- | ---------------------------------------------- | --------------------------- |
| `data-agent-component`  | Yes      | `navigation`                                   | Component type identifier   |
| `data-agent-nav-type`   | No       | `primary`, `secondary`, `breadcrumb`, `footer` | Navigation hierarchy level  |
| `data-agent-action`     | Yes      | Action identifier                              | Semantic action description |
| `data-agent-nav-target` | No       | Target page identifier                         | Destination page type       |

#### Content Components

```html
<!-- Product catalog -->
<section
  data-agent-component="product-list"
  data-agent-list-type="featured|category|search-results"
  data-agent-count="12"
  role="region"
  aria-labelledby="products-heading"
>
  <h2 id="products-heading" data-agent-content="section-title">
    Featured Products
  </h2>

  <div role="list">
    <article
      data-agent-component="product-card"
      data-agent-product-id="prod-123"
      data-agent-category="electronics"
      role="listitem"
      itemscope
      itemtype="https://schema.org/Product"
    >
      <h3 data-agent-content="product-name" itemprop="name">
        Wireless Headphones
      </h3>

      <p data-agent-content="product-description" itemprop="description">
        Premium wireless headphones with noise cancellation
      </p>

      <span
        data-agent-content="product-price"
        itemprop="offers"
        itemscope
        itemtype="https://schema.org/Offer"
      >
        <span itemprop="price" content="199.99">$199.99</span>
        <meta itemprop="priceCurrency" content="USD" />
      </span>

      <button
        data-agent-action="view-product-details"
        data-agent-product-id="prod-123"
        type="button"
      >
        View Details
      </button>
    </article>
  </div>
</section>
```

#### Form Components

```html
<!-- Contact form -->
<form
  data-agent-component="contact-form"
  data-agent-form-type="contact|newsletter|checkout|login"
  data-agent-form-steps="1"
  method="POST"
  action="/contact"
>
  <fieldset data-agent-section="contact-info">
    <legend data-agent-content="fieldset-label">Contact Information</legend>

    <div class="form-group">
      <label for="name" data-agent-content="field-label"> Full Name * </label>
      <input
        type="text"
        id="name"
        name="name"
        required
        data-agent-field="customer-name"
        data-agent-validation="required|text"
        aria-describedby="name-help"
      />
      <small id="name-help" data-agent-content="field-help">
        Your full name for our records
      </small>
    </div>

    <div class="form-group">
      <label for="email" data-agent-content="field-label">
        Email Address *
      </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        data-agent-field="customer-email"
        data-agent-validation="required|email"
        aria-describedby="email-help"
      />
      <small id="email-help" data-agent-content="field-help">
        We'll use this to respond to your inquiry
      </small>
    </div>
  </fieldset>

  <button
    type="submit"
    data-agent-action="submit-contact-form"
    data-agent-submit-target="/contact"
  >
    Send Message
  </button>
</form>
```

### Action Attributes

#### Standard Actions

| Action                 | Context    | Description               | Example                                                                    |
| ---------------------- | ---------- | ------------------------- | -------------------------------------------------------------------------- |
| `go-home`              | Navigation | Navigate to homepage      | `<a data-agent-action="go-home" href="/">`                                 |
| `view-products`        | Navigation | View product catalog      | `<a data-agent-action="view-products" href="/products">`                   |
| `view-product-details` | Product    | View specific product     | `<a data-agent-action="view-product-details" data-agent-product-id="123">` |
| `add-to-cart`          | Commerce   | Add item to shopping cart | `<button data-agent-action="add-to-cart" data-agent-product-id="123">`     |
| `submit-form`          | Form       | Submit form data          | `<button data-agent-action="submit-form" type="submit">`                   |
| `search-products`      | Search     | Perform product search    | `<button data-agent-action="search-products" type="submit">`               |
| `get-support`          | Support    | Access help or support    | `<a data-agent-action="get-support" href="/contact">`                      |
| `download-file`        | Content    | Download file or document | `<a data-agent-action="download-file" href="/brochure.pdf">`               |

#### E-commerce Actions

```html
<!-- Shopping cart actions -->
<button data-agent-action="add-to-cart" data-agent-product-id="prod-123">
  Add to Cart
</button>

<button data-agent-action="remove-from-cart" data-agent-product-id="prod-123">
  Remove from Cart
</button>

<button data-agent-action="update-quantity" data-agent-product-id="prod-123">
  Update Quantity
</button>

<!-- Checkout actions -->
<button data-agent-action="proceed-to-checkout" data-agent-cart-total="299.97">
  Checkout ($299.97)
</button>

<button data-agent-action="apply-coupon" data-agent-coupon-field="coupon-input">
  Apply Coupon
</button>

<!-- Product comparison -->
<button
  data-agent-action="compare-products"
  data-agent-product-ids="123,456,789"
>
  Compare Selected
</button>
```

#### Content Actions

```html
<!-- Article interactions -->
<button data-agent-action="share-article" data-agent-article-id="article-456">
  Share Article
</button>

<button
  data-agent-action="bookmark-article"
  data-agent-article-id="article-456"
>
  Bookmark
</button>

<button data-agent-action="print-article" data-agent-article-id="article-456">
  Print Article
</button>

<!-- Content filtering -->
<select data-agent-action="filter-content" data-agent-filter-type="category">
  <option value="all">All Categories</option>
  <option value="tech">Technology</option>
  <option value="business">Business</option>
</select>

<!-- Pagination -->
<a data-agent-action="next-page" data-agent-page="2" href="/articles?page=2">
  Next Page
</a>
```

### Content Attributes

#### Content Labeling

```html
<!-- Page structure -->
<h1 data-agent-content="page-title">Product Catalog</h1>
<p data-agent-content="page-description">Browse our complete product range</p>

<!-- Section structure -->
<h2 data-agent-content="section-title">Featured Products</h2>
<p data-agent-content="section-description">Our most popular items</p>

<!-- Data labeling -->
<span data-agent-content="product-name">Wireless Headphones</span>
<span data-agent-content="product-price">$199.99</span>
<span data-agent-content="product-rating">4.5/5 stars</span>

<!-- Status indicators -->
<span data-agent-content="availability-status">In Stock</span>
<span data-agent-content="shipping-info">Free shipping available</span>

<!-- Help text -->
<small data-agent-content="field-help">Your email will not be shared</small>
<div data-agent-content="error-message">Please enter a valid email address</div>
```

#### Content Types

| Content Type          | Usage                | Example                                        |
| --------------------- | -------------------- | ---------------------------------------------- |
| `page-title`          | Main page heading    | `<h1 data-agent-content="page-title">`         |
| `page-description`    | Page summary         | `<p data-agent-content="page-description">`    |
| `section-title`       | Section heading      | `<h2 data-agent-content="section-title">`      |
| `section-description` | Section summary      | `<p data-agent-content="section-description">` |
| `product-name`        | Product title        | `<span data-agent-content="product-name">`     |
| `product-price`       | Price information    | `<span data-agent-content="product-price">`    |
| `product-rating`      | Rating/review data   | `<span data-agent-content="product-rating">`   |
| `field-label`         | Form field label     | `<label data-agent-content="field-label">`     |
| `field-help`          | Help text            | `<small data-agent-content="field-help">`      |
| `error-message`       | Error information    | `<div data-agent-content="error-message">`     |
| `success-message`     | Success notification | `<div data-agent-content="success-message">`   |

### Field Attributes

#### Form Field Types

```html
<!-- Customer information -->
<input data-agent-field="customer-name" type="text" name="name" />
<input data-agent-field="customer-email" type="email" name="email" />
<input data-agent-field="customer-phone" type="tel" name="phone" />

<!-- Address information -->
<input data-agent-field="billing-address-street" type="text" name="street" />
<input data-agent-field="billing-address-city" type="text" name="city" />
<select data-agent-field="billing-address-state" name="state">
  <input data-agent-field="billing-address-zip" type="text" name="zip" />

  <!-- Product selection -->
  <select data-agent-field="product-category" name="category">
    <input data-agent-field="product-quantity" type="number" name="quantity" />
    <input data-agent-field="product-search-query" type="search" name="q" />

    <!-- Payment information -->
    <input
      data-agent-field="payment-card-number"
      type="text"
      name="card_number"
    />
    <select data-agent-field="payment-card-expiry-month" name="exp_month">
      <select data-agent-field="payment-card-expiry-year" name="exp_year">
        <input data-agent-field="payment-card-cvv" type="text" name="cvv" />

        <!-- Communication preferences -->
        <input
          data-agent-field="newsletter-subscription"
          type="checkbox"
          name="newsletter"
        />
        <textarea data-agent-field="customer-message" name="message"></textarea>
        <select data-agent-field="inquiry-type" name="subject"></select>
      </select>
    </select>
  </select>
</select>
```

#### Field Validation

```html
<input
  data-agent-field="customer-email"
  data-agent-validation="required|email|max:255"
  data-agent-error-target="email-error"
  type="email"
  name="email"
  required
  aria-describedby="email-error"
/>
<div id="email-error" data-agent-content="error-message" role="alert"></div>
```

**Validation Types:**

- `required` - Field is mandatory
- `email` - Must be valid email format
- `phone` - Must be valid phone number
- `url` - Must be valid URL
- `min:n` - Minimum length/value
- `max:n` - Maximum length/value
- `pattern:regex` - Custom regex pattern
- `numeric` - Must be numeric
- `alpha` - Must be alphabetic
- `alphanumeric` - Must be alphanumeric

## Structured Data Schemas

### Product Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "image": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  "sku": "PROD-123",
  "mpn": "MPN-456",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "category": "Electronics > Audio > Headphones",
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/123",
    "priceCurrency": "USD",
    "price": "199.99",
    "priceValidUntil": "2024-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {
      "@type": "Organization",
      "name": "Your Store Name"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0.00",
        "currency": "USD"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "businessDays": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        },
        "cutoffTime": "16:00",
        "handlingTime": {
          "@type": "QuantitativeValue",
          "minValue": 1,
          "maxValue": 2,
          "unitCode": "DAY"
        }
      }
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "John Doe"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Excellent product quality and fast shipping."
    }
  ]
}
```

### Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Headline",
  "description": "Article description or excerpt",
  "image": "https://example.com/article-image.jpg",
  "datePublished": "2024-01-15T09:00:00Z",
  "dateModified": "2024-01-16T10:30:00Z",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/authors/author-name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Publisher Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png",
      "width": 200,
      "height": 60
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/articles/article-slug"
  },
  "articleSection": "Technology",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "wordCount": 1250,
  "timeRequired": "PT5M"
}
```

### Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "description": "Company description",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Spanish"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Business Street",
    "addressLocality": "Business City",
    "addressRegion": "State",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://facebook.com/company",
    "https://twitter.com/company",
    "https://linkedin.com/company/company"
  ]
}
```

### WebSite Schema

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Website Name",
  "description": "Website description",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Company Name"
  }
}
```

### FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is your return policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a 30-day return policy for all unused items in original packaging."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer international shipping?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we ship to over 50 countries worldwide. Shipping costs vary by destination."
      }
    }
  ]
}
```

## HTTP Headers and Meta Tags

### Agent Detection Headers

#### Request Headers (Incoming)

```http
User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
From: googlebot(at)googlebot.com
```

#### Response Headers (Outgoing)

```http
X-Agent-Optimized: true
X-Agent-Framework: agentux/2.1.0
X-Agent-Rendering: ssr
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Cache-Control: public, max-age=3600
Vary: User-Agent
```

### Meta Tags

#### Essential Meta Tags

```html
<head>
  <!-- Basic meta tags -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta
    name="description"
    content="Page description for search engines and agents"
  />
  <meta name="keywords" content="keyword1, keyword2, keyword3" />
  <meta name="robots" content="index, follow" />

  <!-- Agent-specific meta tags -->
  <meta name="agent-page" content="product-catalog" />
  <meta name="agent-intent" content="browse-products" />
  <meta name="agent-framework" content="next.js" />
  <meta name="agent-version" content="2.1.0" />

  <!-- Open Graph for social media agents -->
  <meta property="og:title" content="Page Title" />
  <meta property="og:description" content="Page description" />
  <meta property="og:image" content="https://example.com/image.jpg" />
  <meta property="og:url" content="https://example.com/current-page" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Site Name" />

  <!-- Twitter Card for Twitter agents -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Page Title" />
  <meta name="twitter:description" content="Page description" />
  <meta name="twitter:image" content="https://example.com/image.jpg" />
  <meta name="twitter:site" content="@yourusername" />

  <!-- Canonical URL for search engines -->
  <link rel="canonical" href="https://example.com/current-page" />

  <!-- Preload critical resources for agents -->
  <link rel="preload" href="/critical.css" as="style" />
  <link rel="preload" href="/api/products" as="fetch" crossorigin="anonymous" />
</head>
```

#### E-commerce Meta Tags

```html
<!-- Product-specific meta tags -->
<meta name="product:price:amount" content="199.99" />
<meta name="product:price:currency" content="USD" />
<meta name="product:availability" content="in stock" />
<meta name="product:condition" content="new" />
<meta name="product:brand" content="Brand Name" />
<meta name="product:category" content="Electronics" />

<!-- Shopping-specific Open Graph -->
<meta property="product:price:amount" content="199.99" />
<meta property="product:price:currency" content="USD" />
<meta property="og:availability" content="instock" />
<meta property="og:condition" content="new" />
```

#### Article Meta Tags

```html
<!-- Article-specific meta tags -->
<meta name="article:author" content="Author Name" />
<meta name="article:published_time" content="2024-01-15T09:00:00Z" />
<meta name="article:modified_time" content="2024-01-16T10:30:00Z" />
<meta name="article:section" content="Technology" />
<meta name="article:tag" content="web development" />
<meta name="article:tag" content="accessibility" />

<!-- Open Graph for articles -->
<meta property="og:type" content="article" />
<meta
  property="article:author"
  content="https://example.com/authors/author-name"
/>
<meta property="article:published_time" content="2024-01-15T09:00:00Z" />
<meta property="article:modified_time" content="2024-01-16T10:30:00Z" />
<meta property="article:section" content="Technology" />
<meta property="article:tag" content="web development" />
```

## JavaScript Detection API

### Agent Detection Function

```javascript
/**
 * BiModal Design Detection Library
 * Detects and categorizes user agents for optimal experience delivery
 */

class BiModalDesignDetector {
  constructor(config = {}) {
    this.config = {
      enableAnalytics: config.enableAnalytics ?? true,
      customPatterns: config.customPatterns ?? {},
      strictMode: config.strictMode ?? false,
      ...config,
    };

    this.agentInfo = null;
    this.capabilities = null;
  }

  /**
   * Detect agent type and capabilities
   * @param {string} userAgent - User agent string (optional, uses navigator.userAgent if not provided)
   * @returns {AgentInfo} Agent detection results
   */
  detect(userAgent = navigator.userAgent) {
    const detection = this.analyzeUserAgent(userAgent);
    const capabilities = this.detectCapabilities();

    this.agentInfo = {
      ...detection,
      capabilities,
      timestamp: new Date().toISOString(),
      sessionId: this.generateSessionId(),
    };

    if (this.config.enableAnalytics) {
      this.trackDetection(this.agentInfo);
    }

    return this.agentInfo;
  }

  /**
   * Analyze user agent string for patterns
   * @private
   */
  analyzeUserAgent(userAgent) {
    const patterns = {
      // Search engine bots
      search: [
        { pattern: /googlebot/i, name: 'GoogleBot', vendor: 'Google' },
        { pattern: /bingbot/i, name: 'BingBot', vendor: 'Microsoft' },
        { pattern: /slurp/i, name: 'Yahoo Slurp', vendor: 'Yahoo' },
        { pattern: /duckduckbot/i, name: 'DuckDuckBot', vendor: 'DuckDuckGo' },
        { pattern: /baiduspider/i, name: 'Baidu Spider', vendor: 'Baidu' },
        { pattern: /yandexbot/i, name: 'YandexBot', vendor: 'Yandex' },
      ],

      // Social media bots
      social: [
        {
          pattern: /facebookexternalhit/i,
          name: 'Facebook Bot',
          vendor: 'Meta',
        },
        { pattern: /twitterbot/i, name: 'TwitterBot', vendor: 'Twitter' },
        { pattern: /linkedinbot/i, name: 'LinkedInBot', vendor: 'LinkedIn' },
        { pattern: /whatsapp/i, name: 'WhatsApp Bot', vendor: 'Meta' },
        { pattern: /telegrambot/i, name: 'Telegram Bot', vendor: 'Telegram' },
      ],

      // Shopping and comparison bots
      shopping: [
        { pattern: /shopping/i, name: 'Shopping Bot', vendor: 'Generic' },
        { pattern: /price/i, name: 'Price Comparison', vendor: 'Generic' },
        { pattern: /comparison/i, name: 'Comparison Bot', vendor: 'Generic' },
        { pattern: /pronto/i, name: 'Pronto', vendor: 'Pronto' },
      ],

      // Automation and testing tools
      automation: [
        { pattern: /headless/i, name: 'Headless Browser', vendor: 'Generic' },
        { pattern: /selenium/i, name: 'Selenium', vendor: 'Selenium' },
        { pattern: /playwright/i, name: 'Playwright', vendor: 'Microsoft' },
        { pattern: /puppeteer/i, name: 'Puppeteer', vendor: 'Google' },
        { pattern: /cypress/i, name: 'Cypress', vendor: 'Cypress' },
      ],

      // Command line tools
      cli: [
        { pattern: /curl/i, name: 'cURL', vendor: 'cURL' },
        { pattern: /wget/i, name: 'Wget', vendor: 'GNU' },
        { pattern: /httpie/i, name: 'HTTPie', vendor: 'HTTPie' },
        { pattern: /postman/i, name: 'Postman', vendor: 'Postman' },
      ],

      // Generic bots
      generic: [
        { pattern: /bot/i, name: 'Generic Bot', vendor: 'Unknown' },
        { pattern: /crawler/i, name: 'Generic Crawler', vendor: 'Unknown' },
        { pattern: /spider/i, name: 'Generic Spider', vendor: 'Unknown' },
      ],

      // Custom patterns from config
      ...this.config.customPatterns,
    };

    // Find matching pattern
    for (const [category, categoryPatterns] of Object.entries(patterns)) {
      for (const { pattern, name, vendor } of categoryPatterns) {
        if (pattern.test(userAgent)) {
          return {
            isAgent: true,
            category,
            name,
            vendor,
            userAgent,
            confidence: this.calculateConfidence(userAgent, pattern),
          };
        }
      }
    }

    // No agent pattern matched
    return {
      isAgent: false,
      category: 'human',
      name: 'Human User',
      vendor: 'Browser',
      userAgent,
      confidence: 0.95,
    };
  }

  /**
   * Detect browser/agent capabilities
   * @private
   */
  detectCapabilities() {
    if (typeof window === 'undefined') {
      return { environment: 'server' };
    }

    return {
      environment: 'browser',
      environment: 'browser',
      javascript: true,
      cookies: navigator.cookieEnabled || false,
      localStorage: this.testLocalStorage(),
      sessionStorage: this.testSessionStorage(),
      indexedDB: 'indexedDB' in window,
      webGL: this.testWebGL(),
      canvas: this.testCanvas(),
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      webRTC: this.testWebRTC(),
      mediaDevices: 'mediaDevices' in navigator,
      touchSupport: 'ontouchstart' in window,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1,
      },
      connection: this.getConnectionInfo(),
      memory: navigator.deviceMemory || null,
      cores: navigator.hardwareConcurrency || null,
    };
  }

  /**
   * Test localStorage availability
   * @private
   */
  testLocalStorage() {
    try {
      const test = 'agentux_test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Test sessionStorage availability
   * @private
   */
  testSessionStorage() {
    try {
      const test = 'agentux_test';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Test WebGL support
   * @private
   */
  testWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * Test Canvas support
   * @private
   */
  testCanvas() {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    } catch (e) {
      return false;
    }
  }

  /**
   * Test WebRTC support
   * @private
   */
  testWebRTC() {
    return !!(
      window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection
    );
  }

  /**
   * Get connection information
   * @private
   */
  getConnectionInfo() {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    return connection
      ? {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        }
      : null;
  }

  /**
   * Calculate confidence score for agent detection
   * @private
   */
  calculateConfidence(userAgent, pattern) {
    const length = userAgent.length;
    const matches = userAgent.match(pattern);

    // Base confidence on pattern specificity and user agent completeness
    let confidence = 0.8;

    if (matches && matches[0].length > 10) confidence += 0.1;
    if (length > 50) confidence += 0.05;
    if (length < 20) confidence -= 0.2;

    return Math.min(0.99, Math.max(0.1, confidence));
  }

  /**
   * Generate unique session ID
   * @private
   */
  generateSessionId() {
    return (
      'agentux_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    );
  }

  /**
   * Track agent detection for analytics
   * @private
   */
  trackDetection(agentInfo) {
    if (typeof window !== 'undefined' && window.fetch) {
      fetch('/api/agentux/detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentInfo),
      }).catch(() => {}); // Silent fail for analytics
    }
  }

  /**
   * Get agent preferences based on detection
   * @returns {AgentPreferences} Recommended preferences for detected agent
   */
  getPreferences() {
    if (!this.agentInfo) {
      throw new Error('Must call detect() first');
    }

    const preferences = {
      preferStatic: false,
      preferTraditionalNav: false,
      preferSimpleUI: false,
      preferStructuredData: true,
      enhanceSemantics: true,
      disableAnimations: false,
      prioritizePerformance: false,
    };

    switch (this.agentInfo.category) {
      case 'search':
        preferences.preferStatic = true;
        preferences.preferTraditionalNav = true;
        preferences.preferSimpleUI = true;
        preferences.disableAnimations = true;
        preferences.prioritizePerformance = true;
        break;

      case 'social':
        preferences.preferStatic = true;
        preferences.preferTraditionalNav = true;
        preferences.enhanceSemantics = true;
        break;

      case 'shopping':
        preferences.preferStructuredData = true;
        preferences.enhanceSemantics = true;
        preferences.prioritizePerformance = true;
        break;

      case 'cli':
        preferences.preferStatic = true;
        preferences.preferTraditionalNav = true;
        preferences.preferSimpleUI = true;
        preferences.disableAnimations = true;
        break;

      case 'automation':
        preferences.preferTraditionalNav = false; // Can handle SPAs
        preferences.enhanceSemantics = true;
        break;

      default:
        // Keep defaults for unknown agents
        break;
    }

    // Override based on capabilities
    if (!this.agentInfo.capabilities.javascript) {
      preferences.preferStatic = true;
      preferences.preferTraditionalNav = true;
      preferences.preferSimpleUI = true;
    }

    return preferences;
  }

  /**
   * Apply agent-specific enhancements to the page
   * @param {AgentPreferences} customPreferences - Override default preferences
   */
  enhance(customPreferences = {}) {
    if (!this.agentInfo?.isAgent) return;

    const preferences = { ...this.getPreferences(), ...customPreferences };

    // Apply document-level attributes
    document.documentElement.setAttribute('data-agent-context', 'detected');
    document.documentElement.setAttribute(
      'data-agent-type',
      this.agentInfo.name
    );
    document.documentElement.setAttribute(
      'data-agent-category',
      this.agentInfo.category
    );

    // Apply performance optimizations
    if (preferences.disableAnimations) {
      this.disableAnimations();
    }

    if (preferences.enhanceSemantics) {
      this.enhanceSemantics();
    }

    if (preferences.preferSimpleUI) {
      this.simplifyUI();
    }

    // Add navigation aids
    this.addNavigationAids(preferences);
  }

  /**
   * Disable animations for performance
   * @private
   */
  disableAnimations() {
    const style = document.createElement('style');
    style.id = 'agentux-animations';
    style.textContent = `
      [data-agent-context="detected"] *,
      [data-agent-context="detected"] *::before,
      [data-agent-context="detected"] *::after {
        animation-duration: 0.01ms !important;
        animation-delay: -0.01ms !important;
        transition-duration: 0.01ms !important;
        transition-delay: -0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Enhance semantic markup
   * @private
   */
  enhanceSemantics() {
    // Add missing ARIA labels
    const buttons = document.querySelectorAll(
      'button:not([aria-label]):not([aria-labelledby])'
    );
    buttons.forEach((button) => {
      const text = button.textContent.trim();
      if (text) {
        button.setAttribute('aria-label', text);
      }
    });

    // Enhance form fields
    const inputs = document.querySelectorAll(
      'input:not([aria-label]):not([aria-labelledby])'
    );
    inputs.forEach((input) => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label && !input.hasAttribute('aria-label')) {
        input.setAttribute(
          'aria-labelledby',
          label.id || this.generateId('label')
        );
      }
    });

    // Add agent-specific attributes to interactive elements
    this.addAgentAttributes();
  }

  /**
   * Add agent-specific attributes to elements
   * @private
   */
  addAgentAttributes() {
    // Add action attributes to buttons
    const buttons = document.querySelectorAll(
      'button:not([data-agent-action])'
    );
    buttons.forEach((button) => {
      const text = button.textContent.toLowerCase();
      let action = 'button-click';

      if (text.includes('submit') || text.includes('send'))
        action = 'submit-form';
      else if (text.includes('search')) action = 'perform-search';
      else if (text.includes('buy') || text.includes('purchase'))
        action = 'initiate-purchase';
      else if (text.includes('add') && text.includes('cart'))
        action = 'add-to-cart';
      else if (text.includes('contact') || text.includes('support'))
        action = 'get-support';

      button.setAttribute('data-agent-action', action);
    });

    // Add navigation attributes to links
    const links = document.querySelectorAll('a:not([data-agent-action])');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      const text = link.textContent.toLowerCase();
      let action = 'navigate';

      if (href === '/' || text.includes('home')) action = 'go-home';
      else if (href?.includes('product') || text.includes('product'))
        action = 'view-products';
      else if (href?.includes('contact') || text.includes('contact'))
        action = 'get-support';
      else if (href?.includes('about') || text.includes('about'))
        action = 'view-about';

      link.setAttribute('data-agent-action', action);
    });
  }

  /**
   * Simplify UI for better agent parsing
   * @private
   */
  simplifyUI() {
    const style = document.createElement('style');
    style.id = 'agentux-simplify';
    style.textContent = `
      [data-agent-context="detected"] {
        font-size: 16px !important;
        line-height: 1.6 !important;
      }
      [data-agent-context="detected"] * {
        box-shadow: none !important;
        text-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Add navigation aids for agents
   * @private
   */
  addNavigationAids(preferences) {
    // Add skip links if not present
    if (!document.querySelector('.agentux-skip-link')) {
      this.addSkipLinks();
    }

    // Add breadcrumbs if appropriate
    if (
      preferences.preferTraditionalNav &&
      !document.querySelector('[data-agentux-breadcrumbs]')
    ) {
      this.addBreadcrumbs();
    }
  }

  /**
   * Add skip links for accessibility
   * @private
   */
  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'agentux-skip-link';
    skipLink.setAttribute('data-agent-action', 'skip-to-content');

    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      font-size: 14px;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * Add breadcrumb navigation
   * @private
   */
  addBreadcrumbs() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);

    if (segments.length === 0) return;

    const nav =
      document.querySelector('nav') || document.querySelector('header');
    if (!nav) return;

    const breadcrumbs = document.createElement('nav');
    breadcrumbs.setAttribute('aria-label', 'Breadcrumb');
    breadcrumbs.setAttribute('data-agentux-breadcrumbs', 'true');
    breadcrumbs.className = 'agentux-breadcrumbs';

    let breadcrumbHTML =
      '<ol style="display: flex; gap: 0.5rem; margin: 0; padding: 0.5rem; list-style: none; font-size: 0.875rem;">';
    breadcrumbHTML +=
      '<li><a href="/" data-agent-action="go-home">Home</a></li>';

    segments.forEach((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      const isLast = index === segments.length - 1;
      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

      breadcrumbHTML += '<li><span aria-hidden="true"> › </span>';

      if (isLast) {
        breadcrumbHTML += `<span aria-current="page" data-agent-content="current-page">${label}</span>`;
      } else {
        breadcrumbHTML += `<a href="${path}" data-agent-action="navigate-to-${segment}">${label}</a>`;
      }

      breadcrumbHTML += '</li>';
    });

    breadcrumbHTML += '</ol>';
    breadcrumbs.innerHTML = breadcrumbHTML;

    nav.appendChild(breadcrumbs);
  }

  /**
   * Generate unique ID for elements
   * @private
   */
  generateId(prefix = 'agentux') {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Usage Examples
const agentDetector = new BiModalDesignDetector({
  enableAnalytics: true,
  customPatterns: {
    'custom-bots': [
      { pattern: /mycompanybot/i, name: 'Company Bot', vendor: 'My Company' },
    ],
  },
});

// Detect agent
const agentInfo = agentDetector.detect();

// Apply enhancements if agent detected
if (agentInfo.isAgent) {
  agentDetector.enhance();
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BiModalDesignDetector;
}

// Global access for direct script inclusion
if (typeof window !== 'undefined') {
  window.BiModalDesignDetector = BiModalDesignDetector;
}
```

### Enhancement API

```javascript
/**
 * BiModal Design Enhancement Utilities
 * Additional utilities for enhancing pages for agents
 */

class BiModalDesignEnhancer {
  constructor(detector) {
    this.detector = detector;
    this.enhancements = new Set();
  }

  /**
   * Enhance forms for better agent accessibility
   * @param {string} selector - Form selector (default: 'form')
   */
  enhanceForms(selector = 'form') {
    const forms = document.querySelectorAll(selector);

    forms.forEach((form) => {
      if (this.enhancements.has(form)) return;

      // Add form-level attributes
      if (!form.hasAttribute('data-agent-component')) {
        form.setAttribute('data-agent-component', 'form');
      }

      // Enhance fieldsets
      const fieldsets = form.querySelectorAll('fieldset');
      fieldsets.forEach((fieldset, index) => {
        if (!fieldset.hasAttribute('data-agent-section')) {
          fieldset.setAttribute('data-agent-section', `section-${index + 1}`);
        }
      });

      // Enhance form fields
      const fields = form.querySelectorAll('input, select, textarea');
      fields.forEach((field) => {
        this.enhanceFormField(field);
      });

      // Enhance submit buttons
      const submitButtons = form.querySelectorAll('[type="submit"]');
      submitButtons.forEach((button) => {
        if (!button.hasAttribute('data-agent-action')) {
          button.setAttribute('data-agent-action', 'submit-form');
        }
      });

      this.enhancements.add(form);
    });
  }

  /**
   * Enhance individual form field
   * @private
   */
  enhanceFormField(field) {
    // Add field type attribute
    if (!field.hasAttribute('data-agent-field')) {
      const fieldType = this.inferFieldType(field);
      field.setAttribute('data-agent-field', fieldType);
    }

    // Add validation attributes
    if (
      field.hasAttribute('required') &&
      !field.hasAttribute('data-agent-validation')
    ) {
      field.setAttribute('data-agent-validation', 'required');
    }

    // Enhance labels
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label && !label.hasAttribute('data-agent-content')) {
      label.setAttribute('data-agent-content', 'field-label');
    }
  }

  /**
   * Infer field type from element
   * @private
   */
  inferFieldType(field) {
    const name = field.name?.toLowerCase() || '';
    const id = field.id?.toLowerCase() || '';
    const placeholder = field.placeholder?.toLowerCase() || '';
    const label =
      document
        .querySelector(`label[for="${field.id}"]`)
        ?.textContent?.toLowerCase() || '';

    const text = `${name} ${id} ${placeholder} ${label}`;

    // Common field types
    if (/email/.test(text)) return 'customer-email';
    if (/name/.test(text) && !/user/.test(text)) return 'customer-name';
    if (/phone|tel/.test(text)) return 'customer-phone';
    if (/address/.test(text)) return 'customer-address';
    if (/city/.test(text)) return 'address-city';
    if (/state|region/.test(text)) return 'address-state';
    if (/zip|postal/.test(text)) return 'address-zip';
    if (/country/.test(text)) return 'address-country';
    if (/message|comment/.test(text)) return 'customer-message';
    if (/subject/.test(text)) return 'inquiry-subject';
    if (/company|organization/.test(text)) return 'customer-company';
    if (/quantity/.test(text)) return 'product-quantity';
    if (/search/.test(text)) return 'search-query';

    return 'user-input';
  }

  /**
   * Enhance navigation elements
   * @param {string} selector - Navigation selector (default: 'nav')
   */
  enhanceNavigation(selector = 'nav') {
    const navs = document.querySelectorAll(selector);

    navs.forEach((nav) => {
      if (this.enhancements.has(nav)) return;

      // Add navigation component attribute
      if (!nav.hasAttribute('data-agent-component')) {
        nav.setAttribute('data-agent-component', 'navigation');
      }

      // Enhance navigation links
      const links = nav.querySelectorAll('a');
      links.forEach((link) => {
        if (!link.hasAttribute('data-agent-action')) {
          const action = this.inferLinkAction(link);
          link.setAttribute('data-agent-action', action);
        }
      });

      this.enhancements.add(nav);
    });
  }

  /**
   * Infer link action from element
   * @private
   */
  inferLinkAction(link) {
    const href = link.getAttribute('href')?.toLowerCase() || '';
    const text = link.textContent?.toLowerCase() || '';

    if (href === '/' || text.includes('home')) return 'go-home';
    if (href.includes('product') || text.includes('product'))
      return 'view-products';
    if (href.includes('contact') || text.includes('contact'))
      return 'get-support';
    if (href.includes('about') || text.includes('about')) return 'view-about';
    if (href.includes('cart') || text.includes('cart')) return 'view-cart';
    if (href.includes('checkout') || text.includes('checkout'))
      return 'proceed-checkout';
    if (href.includes('login') || text.includes('login')) return 'user-login';
    if (href.includes('register') || text.includes('register'))
      return 'user-register';

    return 'navigate';
  }

  /**
   * Add structured data to page
   * @param {Object} data - Structured data object
   * @param {string} id - Script element ID (optional)
   */
  addStructuredData(data, id = null) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);

    if (id) {
      script.id = id;
    }

    document.head.appendChild(script);
  }

  /**
   * Enhance images with proper alt text and structured data
   * @param {string} selector - Image selector (default: 'img')
   */
  enhanceImages(selector = 'img') {
    const images = document.querySelectorAll(selector);

    images.forEach((img) => {
      if (this.enhancements.has(img)) return;

      // Ensure alt text exists
      if (!img.hasAttribute('alt')) {
        // Try to infer from context
        const figcaption = img.closest('figure')?.querySelector('figcaption');
        const title = img.getAttribute('title');

        if (figcaption) {
          img.setAttribute('alt', figcaption.textContent.trim());
        } else if (title) {
          img.setAttribute('alt', title);
        } else {
          img.setAttribute('alt', 'Image'); // Fallback
        }
      }

      // Add agent attributes for product images
      if (img.closest('[data-agent-component="product-card"]')) {
        img.setAttribute('data-agent-content', 'product-image');
      }

      this.enhancements.add(img);
    });
  }

  /**
   * Enhance tables with proper headers and structure
   * @param {string} selector - Table selector (default: 'table')
   */
  enhanceTables(selector = 'table') {
    const tables = document.querySelectorAll(selector);

    tables.forEach((table) => {
      if (this.enhancements.has(table)) return;

      // Add table component attribute
      if (!table.hasAttribute('data-agent-component')) {
        table.setAttribute('data-agent-component', 'data-table');
      }

      // Enhance headers
      const headers = table.querySelectorAll('th');
      headers.forEach((header) => {
        if (!header.hasAttribute('data-agent-content')) {
          header.setAttribute('data-agent-content', 'table-header');
        }

        // Add scope if not present
        if (!header.hasAttribute('scope')) {
          header.setAttribute('scope', 'col');
        }
      });

      // Add caption if missing
      if (
        !table.querySelector('caption') &&
        table.previousElementSibling?.tagName === 'H2'
      ) {
        const caption = document.createElement('caption');
        caption.textContent = table.previousElementSibling.textContent;
        table.insertBefore(caption, table.firstChild);
      }

      this.enhancements.add(table);
    });
  }

  /**
   * Monitor for dynamically added content
   */
  startMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Re-enhance new content
            this.enhanceForms();
            this.enhanceNavigation();
            this.enhanceImages();
            this.enhanceTables();
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return observer;
  }
}

// Usage
const enhancer = new BiModalDesignEnhancer(agentDetector);

// Enhance specific elements
enhancer.enhanceForms();
enhancer.enhanceNavigation();
enhancer.enhanceImages();
enhancer.enhanceTables();

// Start monitoring for dynamic content
enhancer.startMutationObserver();
```

## CSS Classes and Selectors

### Agent-Specific CSS Classes

```css
/* Base agent context styles */
[data-agent-context='detected'] {
  /* Apply agent-optimized styles */
  font-size: 16px;
  line-height: 1.6;
  color-scheme: light;
}

/* Performance optimizations for agents */
[data-agent-context='detected'] * {
  /* Disable animations for faster parsing */
  animation-duration: 0.01ms !important;
  animation-delay: -0.01ms !important;
  transition-duration: 0.01ms !important;
  transition-delay: -0.01ms !important;
}

/* Agent category-specific styles */
[data-agent-category='search'] {
  /* Search engine optimizations */
  background: white;
  color: black;
}

[data-agent-category='social'] {
  /* Social media preview optimizations */
  max-width: 1200px;
  margin: 0 auto;
}

[data-agent-category='shopping'] {
  /* Shopping bot optimizations */
  .product-price {
    font-size: 1.5em;
    font-weight: bold;
    color: #e74c3c;
  }
}

/* Component-specific styles */
[data-agent-component='navigation'] {
  /* Enhanced navigation for agents */
  border-bottom: 2px solid #ccc;
  background: #f8f9fa;
}

[data-agent-component='product-card'] {
  /* Product card optimizations */
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
}

[data-agent-component='form'] {
  /* Form optimizations */
  max-width: 600px;
  margin: 0 auto;
}

[data-agent-component='form'] fieldset {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
}

/* Content-specific styles */
[data-agent-content='page-title'] {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

[data-agent-content='section-title'] {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #555;
}

[data-agent-content='product-price'] {
  font-size: 1.25rem;
  font-weight: bold;
  color: #e74c3c;
}

/* Action element styles */
[data-agent-action] {
  /* All actionable elements */
  cursor: pointer;
  outline-offset: 2px;
}

[data-agent-action]:focus-visible {
  outline: 2px solid #007bff;
}

/* Utility classes for agent optimization */
.agentux-hidden {
  display: none;
}

.agentux-visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

.agentux-skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 10000;
}

.agentux-skip-link:focus {
  top: 6px;
}

/* Print styles for CLI agents */
@media print {
  [data-agent-context='detected'] {
    background: white !important;
    color: black !important;
  }

  [data-agent-action]::after {
    content: ' [' attr(data-agent-action) ']';
    font-size: 0.8em;
    color: #666;
  }
}

/* High contrast mode for accessibility agents */
@media (prefers-contrast: high) {
  [data-agent-context='detected'] {
    background: white;
    color: black;
  }

  [data-agent-component] {
    border: 2px solid black;
  }
}

/* Reduced motion for agents that prefer minimal animations */
@media (prefers-reduced-motion: reduce) {
  [data-agent-context='detected'] * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Responsive Styles for Agents

```css
/* Mobile agent optimizations */
@media (max-width: 768px) {
  [data-agent-context='detected'] {
    font-size: 18px; /* Larger text for mobile agents */
  }

  [data-agent-component='navigation'] {
    /* Stack navigation for mobile agents */
    flex-direction: column;
  }

  [data-agent-component='product-card'] {
    /* Full width on mobile */
    width: 100%;
    margin-bottom: 2rem;
  }
}

/* Large screen agent optimizations */
@media (min-width: 1200px) {
  [data-agent-context='detected'] {
    max-width: 1200px;
    margin: 0 auto;
  }

  [data-agent-component='product-list'] {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
}
```

## Server-Side Implementation

### Node.js/Express Agent Detection

```javascript
/**
 * BiModal Design Server-Side Implementation
 * Express.js middleware for agent detection and routing
 */

const BiModal DesignServer = {
  // Agent detection patterns
  patterns: {
    search: [
      /googlebot/i,
      /bingbot/i,
      /slurp/i,
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i,
    ],
    social: [
      /facebookexternalhit/i,
      /twitterbot/i,
      /linkedinbot/i,
      /whatsapp/i,
      /telegrambot/i,
    ],
    shopping: [/shopping/i, /price/i, /comparison/i, /pronto/i],
    automation: [
      /headless/i,
      /selenium/i,
      /playwright/i,
      /puppeteer/i,
      /cypress/i,
    ],
    cli: [/curl/i, /wget/i, /httpie/i, /postman/i],
  },

  /**
   * Express middleware for agent detection
   */
  middleware() {
    return (req, res, next) => {
      const userAgent = req.get('User-Agent') || '';
      const detection = this.detectAgent(userAgent);

      // Add agent info to request
      req.agent = detection;

      // Add response headers
      if (detection.isAgent) {
        res.set('X-Agent-Detected', 'true');
        res.set('X-Agent-Category', detection.category);
        res.set('X-Agent-Name', detection.name);
      }

      next();
    };
  },

  /**
   * Detect agent from user agent string
   */
  detectAgent(userAgent) {
    for (const [category, patterns] of Object.entries(this.patterns)) {
      for (const pattern of patterns) {
        if (pattern.test(userAgent)) {
          return {
            isAgent: true,
            category,
            name: this.extractAgentName(userAgent, pattern),
            userAgent,
            timestamp: new Date().toISOString(),
          };
        }
      }
    }

    // Check for generic bot patterns
    if (/bot|crawler|spider/i.test(userAgent)) {
      return {
        isAgent: true,
        category: 'generic',
        name: 'Generic Bot',
        userAgent,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      isAgent: false,
      category: 'human',
      name: 'Human User',
      userAgent,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Extract agent name from user agent
   */
  extractAgentName(userAgent, pattern) {
    const match = userAgent.match(pattern);
    if (match) {
      return match[0];
    }
    return 'Unknown Agent';
  },

  /**
   * Route handler for agent-optimized content
   */
  agentRoute(options = {}) {
    return (req, res, next) => {
      if (!req.agent?.isAgent) {
        return next();
      }

      const { renderSSR, redirectToStatic, customHandler } = options;

      if (customHandler) {
        return customHandler(req, res, next);
      }

      if (redirectToStatic) {
        const staticPath = this.getStaticPath(req.path);
        return res.redirect(302, staticPath);
      }

      if (renderSSR) {
        return this.renderSSRContent(req, res, renderSSR);
      }

      next();
    };
  },

  /**
   * Get static path for agent content
   */
  getStaticPath(originalPath) {
    // Map dynamic routes to static equivalents
    const staticRoutes = {
      '/': '/static/index.html',
      '/products': '/static/products.html',
      '/contact': '/static/contact.html',
    };

    return staticRoutes[originalPath] || `/static${originalPath}.html`;
  },

  /**
   * Render SSR content for agents
   */
  async renderSSRContent(req, res, renderFunction) {
    try {
      const html = await renderFunction({
        path: req.path,
        query: req.query,
        agent: req.agent,
        headers: req.headers,
      });

      res.set('Content-Type', 'text/html');
      res.set('X-Rendered-For-Agent', 'true');
      res.send(html);
    } catch (error) {
      console.error('SSR rendering failed:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  /**
   * Analytics middleware for agent tracking
   */
  analytics() {
    return (req, res, next) => {
      if (req.agent?.isAgent) {
        // Log agent visit
        this.logAgentVisit({
          userAgent: req.agent.userAgent,
          category: req.agent.category,
          path: req.path,
          query: req.query,
          ip: req.ip,
          timestamp: new Date().toISOString(),
        });
      }

      next();
    };
  },

  /**
   * Log agent visit for analytics
   */
  logAgentVisit(data) {
    // Implementation depends on your analytics system
    console.log('Agent Visit:', JSON.stringify(data, null, 2));

    // Example: Send to analytics service
    // analytics.track('agent_visit', data);
  },
};

// Usage example
const express = require('express');
const app = express();

// Apply agent detection middleware
app.use(BiModal DesignServer.middleware());
app.use(BiModal DesignServer.analytics());

// Route with agent optimization
app.get(
  '/',
  BiModal DesignServer.agentRoute({
    renderSSR: async ({ path, agent }) => {
      if (agent.isAgent) {
        return await renderAgentOptimizedHome(agent);
      }
      return await renderRegularHome();
    },
  }),
  (req, res) => {
    // Regular route handler for non-agents
    res.sendFile(__dirname + '/public/index.html');
  }
);

async function renderAgentOptimizedHome(agent) {
  return `
<!DOCTYPE html>
<html lang="en" data-agent-framework="express" data-agent-optimized="true">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BiModal Design Store - Home</title>
  <meta name="description" content="Products designed for both humans and AI agents">
  <meta name="agent-category" content="${agent.category}">
  <meta name="agent-name" content="${agent.name}">
</head>
<body data-agent-rendered="ssr">
  <header role="banner">
    <nav data-agent-component="navigation" role="navigation">
      <a href="/" data-agent-action="go-home">Home</a>
      <a href="/products" data-agent-action="view-products">Products</a>
      <a href="/contact" data-agent-action="get-support">Contact</a>
    </nav>
  </header>

  <main role="main" data-agent-component="main-content">
    <h1 data-agent-content="page-title">Welcome to BiModal Design Store</h1>
    <p data-agent-content="page-description">
      Products designed for optimal agent and human experience
    </p>
  </main>
</body>
</html>`;
}

module.exports = BiModal DesignServer;
```

### Next.js Implementation

```javascript
// pages/_app.js - Next.js BiModal Design integration
import { useEffect } from 'react';
import { BiModalDesignDetector } from '../lib/agentux';

function MyApp({ Component, pageProps, agentInfo }) {
  useEffect(() => {
    if (agentInfo?.isAgent) {
      const detector = new BiModalDesignDetector();
      detector.enhance();
    }
  }, [agentInfo]);

  return (
    <div
      data-agent-framework="next.js"
      data-agent-detected={agentInfo?.isAgent}
    >
      <Component {...pageProps} agentInfo={agentInfo} />
    </div>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const { req } = appContext.ctx;

  let agentInfo = null;
  if (req) {
    // Server-side agent detection
    const userAgent = req.headers['user-agent'] || '';
    agentInfo = detectServerSideAgent(userAgent);
  }

  return { agentInfo };
};

function detectServerSideAgent(userAgent) {
  // Simplified server-side detection
  const agentPatterns = [
    /googlebot/i,
    /bingbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /headless/i,
    /selenium/i,
    /playwright/i,
    /puppeteer/i,
    /curl/i,
    /wget/i,
    /bot/i,
    /crawler/i,
    /spider/i,
  ];

  const isAgent = agentPatterns.some((pattern) => pattern.test(userAgent));

  return {
    isAgent,
    userAgent,
    detectedAt: 'server',
  };
}

export default MyApp;
```

```javascript
// pages/api/agentux/detection.js - Analytics endpoint
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const agentData = req.body;

  // Validate agent data
  if (!agentData.userAgent || typeof agentData.isAgent !== 'boolean') {
    return res.status(400).json({ error: 'Invalid agent data' });
  }

  // Log to your analytics system
  console.log('Agent Detection:', {
    ...agentData,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    timestamp: new Date().toISOString(),
  });

  // Store in database if needed
  // await storeAgentDetection(agentData);

  res.status(200).json({ success: true });
}
```

## Testing and Validation APIs

### Agent Compatibility Testing

```javascript
/**
 * BiModal Design Testing Utilities
 * Tools for testing agent compatibility
 */

class BiModal DesignTester {
  constructor(options = {}) {
    this.baseURL = options.baseURL || 'http://localhost:3000';
    this.userAgents = options.userAgents || this.getDefaultUserAgents();
    this.timeout = options.timeout || 10000;
  }

  getDefaultUserAgents() {
    return {
      googlebot:
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      bingbot:
        'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      facebookbot:
        'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      twitterbot: 'Twitterbot/1.0',
      curl: 'curl/7.68.0',
      headless:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/91.0.4472.124 Safari/537.36',
      selenium:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 selenium/3.141.59',
      puppeteer:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/91.0.4472.124 Safari/537.36 puppeteer/10.0.0',
    };
  }

  /**
   * Test page accessibility for all agent types
   */
  async testAllAgents(path = '/') {
    const results = {};

    for (const [agentName, userAgent] of Object.entries(this.userAgents)) {
      try {
        results[agentName] = await this.testSingleAgent(path, userAgent);
      } catch (error) {
        results[agentName] = {
          success: false,
          error: error.message,
        };
      }
    }

    return results;
  }

  /**
   * Test page accessibility for single agent
   */
  async testSingleAgent(path, userAgent) {
    const url = `${this.baseURL}${path}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const analysis = this.analyzeHTML(html, userAgent);

    return {
      success: true,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      analysis,
      performance: {
        responseTime: Date.now() - startTime,
        contentLength: html.length,
      },
    };
  }

  /**
   * Analyze HTML content for agent compatibility
   */
  analyzeHTML(html, userAgent) {
    const analysis = {
      hasContent: false,
      hasNavigation: false,
      hasSemanticMarkup: false,
      hasAgentAttributes: false,
      hasStructuredData: false,
      hasAccessibleForms: false,
      contentQuality: 0,
      issues: [],
    };

    // Check for basic content
    if (
      html.includes('<main') ||
      html.includes('<article') ||
      html.includes('<section')
    ) {
      analysis.hasContent = true;
    } else {
      analysis.issues.push('No main content sections found');
    }

    // Check for navigation
    if (html.includes('<nav') || html.includes('role="navigation"')) {
      analysis.hasNavigation = true;
    } else {
      analysis.issues.push('No navigation found');
    }

    // Check for semantic markup
    const semanticElements = [
      '<header',
      '<nav',
      '<main',
      '<article',
      '<section',
      '<aside',
      '<footer',
    ];
    const semanticCount = semanticElements.reduce((count, element) => {
      return count + (html.includes(element) ? 1 : 0);
    }, 0);

    if (semanticCount >= 3) {
      analysis.hasSemanticMarkup = true;
    } else {
      analysis.issues.push('Insufficient semantic markup');
    }

    // Check for agent-specific attributes
    if (html.includes('data-agent-')) {
      analysis.hasAgentAttributes = true;
    } else {
      analysis.issues.push('No agent-specific attributes found');
    }

    // Check for structured data
    if (html.includes('application/ld+json') || html.includes('itemscope')) {
      analysis.hasStructuredData = true;
    } else {
      analysis.issues.push('No structured data found');
    }

    // Check for accessible forms
    if (html.includes('<form')) {
      const hasFieldsets = html.includes('<fieldset');
      const hasLabels = html.includes('<label');

      if (hasFieldsets && hasLabels) {
        analysis.hasAccessibleForms = true;
      } else {
        analysis.issues.push('Forms lack proper accessibility structure');
      }
    }

    // Calculate content quality score
    const positiveFactors = [
      analysis.hasContent,
      analysis.hasNavigation,
      analysis.hasSemanticMarkup,
      analysis.hasAgentAttributes,
      analysis.hasStructuredData,
      analysis.hasAccessibleForms,
    ].filter(Boolean).length;

    analysis.contentQuality = positiveFactors / 6;

    return analysis;
  }

  /**
   * Validate BiModal Design implementation
   */
  async validateImplementation(paths = ['/']) {
    const validation = {
      overall: {
        score: 0,
        passed: false,
        timestamp: new Date().toISOString(),
      },
      paths: {},
      recommendations: [],
    };

    for (const path of paths) {
      const pathResults = await this.testAllAgents(path);
      validation.paths[path] = pathResults;
    }

    // Calculate overall score
    const allResults = Object.values(validation.paths).flat();
    const successfulTests = allResults.filter(
      (result) => result.success && result.analysis?.contentQuality > 0.7
    );

    validation.overall.score = successfulTests.length / allResults.length;
    validation.overall.passed = validation.overall.score >= 0.8;

    // Generate recommendations
    validation.recommendations = this.generateRecommendations(validation);

    return validation;
  }

  /**
   * Generate recommendations based on test results
   */
  generateRecommendations(validation) {
    const recommendations = [];

    // Analyze common issues across all tests
    const allIssues = [];
    Object.values(validation.paths).forEach((pathResults) => {
      Object.values(pathResults).forEach((result) => {
        if (result.analysis?.issues) {
          allIssues.push(...result.analysis.issues);
        }
      });
    });

    // Count issue frequency
    const issueFrequency = {};
    allIssues.forEach((issue) => {
      issueFrequency[issue] = (issueFrequency[issue] || 0) + 1;
    });

    // Generate recommendations based on most common issues
    Object.entries(issueFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .forEach(([issue, count]) => {
        switch (issue) {
          case 'No main content sections found':
            recommendations.push({
              priority: 'high',
              issue: 'Missing semantic content structure',
              solution:
                'Add <main>, <article>, or <section> elements to structure your content',
            });
            break;
          case 'No agent-specific attributes found':
            recommendations.push({
              priority: 'medium',
              issue: 'Missing BiModal Design attributes',
              solution:
                'Add data-agent-* attributes to key elements for better agent understanding',
            });
            break;
          case 'No structured data found':
            recommendations.push({
              priority: 'medium',
              issue: 'Missing structured data',
              solution: 'Add JSON-LD structured data or microdata markup',
            });
            break;
          default:
            recommendations.push({
              priority: 'low',
              issue,
              solution: 'Review BiModal Design implementation guidelines',
            });
        }
      });

    return recommendations;
  }
}

// Usage example
const tester = new BiModal DesignTester({
  baseURL: 'https://example.com',
  timeout: 15000,
});

// Test specific path
const results = await tester.testAllAgents('/products');

// Validate entire implementation
const validation = await tester.validateImplementation([
  '/',
  '/products',
  '/contact',
]);

console.log('Validation Results:', JSON.stringify(validation, null, 2));
```

### Playwright Test Integration

```javascript
// tests/agentux.spec.js - Playwright test suite
const { test, expect } = require('@playwright/test');

const agentUserAgents = {
  googlebot:
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  bingbot:
    'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  curl: 'curl/7.68.0',
  headless:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 HeadlessChrome/91.0.4472.124',
};

Object.entries(agentUserAgents).forEach(([agentName, userAgent]) => {
  test.describe(`BiModal Design compatibility for ${agentName}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setUserAgent(userAgent);
    });

    test('should load homepage with content', async ({ page }) => {
      await page.goto('/');

      // Check for semantic structure
      const main = await page.$('main[role="main"]');
      expect(main).toBeTruthy();

      // Check for content
      const content = await page.textContent('main');
      expect(content.length).toBeGreaterThan(100);

      // Check for agent attributes
      const agentComponents = await page.$('[data-agent-component]');
      expect(agentComponents.length).toBeGreaterThan(0);
    });

    test('should have accessible navigation', async ({ page }) => {
      await page.goto('/');

      // Check for navigation structure
      const nav = await page.$('nav[role="navigation"]');
      expect(nav).toBeTruthy();

      // Check for agent actions
      const navLinks = await page.$('nav [data-agent-action]');
      expect(navLinks.length).toBeGreaterThan(0);

      // Test navigation functionality
      await page.click('[data-agent-action="view-products"]');
      await page.waitForURL('**/products');
    });

    test('should have structured data', async ({ page }) => {
      await page.goto('/');

      // Check for JSON-LD
      const structuredData = await page.$('script[type="application/ld+json"]');
      expect(structuredData).toBeTruthy();

      if (structuredData) {
        const content = await structuredData.textContent();
        const data = JSON.parse(content);
        expect(data['@context']).toBe('https://schema.org');
      }
    });

    test('should handle forms accessibly', async ({ page }) => {
      await page.goto('/contact');

      // Check for form structure
      const form = await page.$('form[data-agent-component="contact-form"]');
      if (form) {
        // Check for fieldsets
        const fieldsets = await page.$('fieldset');
        expect(fieldsets.length).toBeGreaterThan(0);

        // Check for proper labeling
        const labels = await page.$('label[data-agent-content="field-label"]');
        const inputs = await page.$('input[data-agent-field]');
        expect(labels.length).toBeGreaterThanOrEqual(inputs.length * 0.8);
      }
    });

    test('should load quickly for agents', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');

      // Wait for main content
      await page.waitForSelector('[data-agent-content="page-title"]');
      const loadTime = Date.now() - startTime;

      // Agents should get content quickly
      expect(loadTime).toBeLessThan(2000);
    });
  });
});

// Accessibility-specific tests
test.describe('BiModal Design Accessibility', () => {
  test('should pass WCAG compliance', async ({ page }) => {
    await page.goto('/');

    // Check heading hierarchy
    const headings = await page.$('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);

    // Check for proper alt text on images
    const images = await page.$('img');
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }

    // Check for form labels
    const inputs = await page.$('input, select, textarea');
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        const label = await page.$(`label[for="${id}"]`);
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');

        expect(label || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }
  });
});
```

## Framework-Specific Integrations

### React Hook

```javascript
// hooks/useBiModal Design.js
import { useState, useEffect } from 'react';
import { BiModalDesignDetector } from '../lib/agentux';

export function useBiModal Design(options = {}) {
  const [agentInfo, setAgentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detector = new BiModalDesignDetector(options);
    const detection = detector.detect();

    setAgentInfo(detection);
    setIsLoading(false);

    if (detection.isAgent) {
      detector.enhance();
    }
  }, []);

  return {
    agentInfo,
    isAgent: agentInfo?.isAgent || false,
    isLoading,
    agentCategory: agentInfo?.category,
    agentCapabilities: agentInfo?.capabilities,
  };
}

// Component usage
function MyComponent() {
  const { isAgent, agentCategory, isLoading } = useBiModal Design();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div data-agent-detected={isAgent}>
      {isAgent && (
        <div className="agent-notice">Optimized for {agentCategory} agents</div>
      )}
      <main role="main">{/* Your content */}</main>
    </div>
  );
}
```

### Vue Composable

```javascript
// composables/useBiModal Design.js
import { ref, onMounted, readonly } from 'vue';
import { BiModalDesignDetector } from '../lib/agentux';

export function useBiModal Design(options = {}) {
  const agentInfo = ref(null);
  const isLoading = ref(true);

  const detect = () => {
    const detector = new BiModalDesignDetector(options);
    const detection = detector.detect();

    agentInfo.value = detection;
    isLoading.value = false;

    if (detection.isAgent) {
      detector.enhance();
    }
  };

  onMounted(() => {
    detect();
  });

  return {
    agentInfo: readonly(agentInfo),
    isAgent: computed(() => agentInfo.value?.isAgent || false),
    isLoading: readonly(isLoading),
    agentCategory: computed(() => agentInfo.value?.category),
    agentCapabilities: computed(() => agentInfo.value?.capabilities),
  };
}
```

### Angular Service

```typescript
// services/agent-ux.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BiModalDesignDetector } from '../lib/agentux';

export interface AgentInfo {
  isAgent: boolean;
  category?: string;
  name?: string;
  capabilities?: any;
}

@Injectable({
  providedIn: 'root',
})
export class BiModal DesignService {
  private agentInfoSubject = new BehaviorSubject<AgentInfo | null>(null);
  private detector: BiModalDesignDetector;

  constructor() {
    this.detector = new BiModalDesignDetector();
    this.initializeDetection();
  }

  get agentInfo$(): Observable<AgentInfo | null> {
    return this.agentInfoSubject.asObservable();
  }

  get isAgent(): boolean {
    return this.agentInfoSubject.value?.isAgent || false;
  }

  private initializeDetection(): void {
    const detection = this.detector.detect();
    this.agentInfoSubject.next(detection);

    if (detection.isAgent) {
      this.detector.enhance();
    }
  }

  getAgentPreferences() {
    return this.detector.getPreferences();
  }
}

// Component usage
import { Component, OnInit } from '@angular/core';
import { BiModal DesignService } from './services/agent-ux.service';

@Component({
  selector: 'app-root',
  template: `
    <div [attr.data-agent-detected]="agentService.isAgent">
      <div *ngIf="agentService.isAgent" class="agent-notice">
        Agent-optimized interface active
      </div>
      <main role="main">
        <!-- Your content -->
      </main>
    </div>
  `,
})
export class AppComponent implements OnInit {
  constructor(public agentService: BiModal DesignService) {}

  ngOnInit() {
    this.agentService.agentInfo$.subscribe((agentInfo) => {
      console.log('Agent info updated:', agentInfo);
    });
  }
}
```

## Commit Description

````
Add comprehensive BiModal Design API reference documentation

- Complete HTML attributes specification with 50+ data-agent-* attributes
- Structured data schemas for products, articles, organizations, and websites
- HTTP headers and meta tags reference for agent optimization
- Full JavaScript detection API with capability assessment and enhancement
- CSS classes and selectors for agent-specific styling
- Server-side implementation examples for Node.js, Express, and Next.js
- Testing and validation APIs with Playwright integration
- Framework-specific integrations for React, Vue, and Angular
- Agent categorization patterns for search, social, shopping, automation, and CLI
- Performance optimization techniques and responsive design considerations

Provides complete technical specification for developers implementing BiModal Design
Covers all aspects from basic HTML markup to advanced JavaScript detection
Includes production-ready code examples and testing strategies
```# BiModal Design API Reference

Technical specifications and reference documentation for implementing BiModal Design patterns in web applications.

## Table of Contents

1. [HTML Attributes Reference](#html-attributes-reference)
2. [Structured Data Schemas](#structured-data-schemas)
3. [HTTP Headers and Meta Tags](#http-headers-and-meta-tags)
4. [JavaScript Detection API](#javascript-detection-api)
5. [CSS Classes and Selectors](#css-classes-and-selectors)
6. [Server-Side Implementation](#server-side-implementation)
7. [Testing and Validation APIs](#testing-and-validation-apis)
8. [Framework-Specific Integrations](#framework-specific-integrations)

## HTML Attributes Reference

### Core Agent Attributes

All BiModal Design attributes use the `data-agent-*` namespace to ensure compatibility and avoid conflicts.

#### Page-Level Attributes

```html
<!-- Document root attributes -->
<html
  data-agent-framework="react|vue|angular|astro|next|nuxt"
  data-agent-version="major.minor.patch"
  data-agent-context="detected|unknown"
  data-agent-mode="ssr|ssg|csr|hybrid"
>
````

**Attribute Specifications:**

| Attribute              | Required | Values                                                       | Description                           |
| ---------------------- | -------- | ------------------------------------------------------------ | ------------------------------------- |
| `data-agent-framework` | No       | `react`, `vue`, `angular`, `astro`, `next`, `nuxt`, `custom` | Framework used for implementation     |
| `data-agent-version`   | No       | Semantic version string                                      | BiModal Design implementation version |
| `data-agent-context`   | No       | `detected`, `unknown`                                        | Whether agent was detected            |
| `data-agent-mode`      | No       | `ssr`, `ssg`, `csr`, `hybrid`                                | Rendering strategy used               |

#### Page Content Attributes

```html
<!-- Page identification -->
<body
  data-agent-page="home|products|contact|article|dashboard"
  data-agent-intent="browse|search|purchase|support|read"
  data-agent-content-type="product-catalog|article|form|dashboard"
></body>
```

**Page Type Values:**

- `home` - Landing/homepage
- `products` - Product catalog or listing
- `contact` - Contact or support page
- `article` - Content article or blog post
- `dashboard` - User dashboard or admin panel
- `checkout` - Purchase or payment flow
- `search` - Search results page
- `profile` - User profile or account page

**Intent Values:**

- `browse` - Casual browsing behavior
- `search` - Specific search intent
- `purchase` - Commercial transaction intent
- `support` - Help or support seeking
- `read` - Content consumption
- `manage` - Account or data management

### Component Attributes

#### Navigation Components

```html
<!-- Primary navigation -->
<nav
  data-agent-component="navigation"
  data-agent-nav-type="primary|secondary|breadcrumb|footer"
  role="navigation"
  aria-label="Main navigation"
>
  <a
    href="/products"
    data-agent-action="view-products"
    data-agent-nav-target="products"
  >
    Products
  </a>
</nav>
```

**Navigation Component Specification:**

| Attribute               | Required | Values                                         | Description                 |
| ----------------------- | -------- | ---------------------------------------------- | --------------------------- |
| `data-agent-component`  | Yes      | `navigation`                                   | Component type identifier   |
| `data-agent-nav-type`   | No       | `primary`, `secondary`, `breadcrumb`, `footer` | Navigation hierarchy level  |
| `data-agent-action`     | Yes      | Action identifier                              | Semantic action description |
| `data-agent-nav-target` | No       | Target page identifier                         | Destination page type       |

#### Content Components

```html
<!-- Product catalog -->
<section
  data-agent-component="product-list"
  data-agent-list-type="featured|category|search-results"
  data-agent-count="12"
  role="region"
  aria-labelledby="products-heading"
>
  <h2 id="products-heading" data-agent-content="section-title">
    Featured Products
  </h2>

  <div role="list">
    <article
      data-agent-component="product-card"
      data-agent-product-id="prod-123"
      data-agent-category="electronics"
      role="listitem"
      itemscope
      itemtype="https://schema.org/Product"
    >
      <h3 data-agent-content="product-name" itemprop="name">
        Wireless Headphones
      </h3>

      <p data-agent-content="product-description" itemprop="description">
        Premium wireless headphones with noise cancellation
      </p>

      <span
        data-agent-content="product-price"
        itemprop="offers"
        itemscope
        itemtype="https://schema.org/Offer"
      >
        <span itemprop="price" content="199.99">$199.99</span>
        <meta itemprop="priceCurrency" content="USD" />
      </span>

      <button
        data-agent-action="view-product-details"
        data-agent-product-id="prod-123"
        type="button"
      >
        View Details
      </button>
    </article>
  </div>
</section>
```

#### Form Components

```html
<!-- Contact form -->
<form
  data-agent-component="contact-form"
  data-agent-form-type="contact|newsletter|checkout|login"
  data-agent-form-steps="1"
  method="POST"
  action="/contact"
>
  <fieldset data-agent-section="contact-info">
    <legend data-agent-content="fieldset-label">Contact Information</legend>

    <div class="form-group">
      <label for="name" data-agent-content="field-label"> Full Name * </label>
      <input
        type="text"
        id="name"
        name="name"
        required
        data-agent-field="customer-name"
        data-agent-validation="required|text"
        aria-describedby="name-help"
      />
      <small id="name-help" data-agent-content="field-help">
        Your full name for our records
      </small>
    </div>

    <div class="form-group">
      <label for="email" data-agent-content="field-label">
        Email Address *
      </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        data-agent-field="customer-email"
        data-agent-validation="required|email"
        aria-describedby="email-help"
      />
      <small id="email-help" data-agent-content="field-help">
        We'll use this to respond to your inquiry
      </small>
    </div>
  </fieldset>

  <button
    type="submit"
    data-agent-action="submit-contact-form"
    data-agent-submit-target="/contact"
  >
    Send Message
  </button>
</form>
```

### Action Attributes

#### Standard Actions

| Action                 | Context    | Description               | Example                                                                    |
| ---------------------- | ---------- | ------------------------- | -------------------------------------------------------------------------- |
| `go-home`              | Navigation | Navigate to homepage      | `<a data-agent-action="go-home" href="/">`                                 |
| `view-products`        | Navigation | View product catalog      | `<a data-agent-action="view-products" href="/products">`                   |
| `view-product-details` | Product    | View specific product     | `<a data-agent-action="view-product-details" data-agent-product-id="123">` |
| `add-to-cart`          | Commerce   | Add item to shopping cart | `<button data-agent-action="add-to-cart" data-agent-product-id="123">`     |
| `submit-form`          | Form       | Submit form data          | `<button data-agent-action="submit-form" type="submit">`                   |
| `search-products`      | Search     | Perform product search    | `<button data-agent-action="search-products" type="submit">`               |
| `get-support`          | Support    | Access help or support    | `<a data-agent-action="get-support" href="/contact">`                      |
| `download-file`        | Content    | Download file or document | `<a data-agent-action="download-file" href="/brochure.pdf">`               |

#### E-commerce Actions

```html
<!-- Shopping cart actions -->
<button data-agent-action="add-to-cart" data-agent-product-id="prod-123">
  Add to Cart
</button>

<button data-agent-action="remove-from-cart" data-agent-product-id="prod-123">
  Remove from Cart
</button>

<button data-agent-action="update-quantity" data-agent-product-id="prod-123">
  Update Quantity
</button>

<!-- Checkout actions -->
<button data-agent-action="proceed-to-checkout" data-agent-cart-total="299.97">
  Checkout ($299.97)
</button>

<button data-agent-action="apply-coupon" data-agent-coupon-field="coupon-input">
  Apply Coupon
</button>

<!-- Product comparison -->
<button
  data-agent-action="compare-products"
  data-agent-product-ids="123,456,789"
>
  Compare Selected
</button>
```

#### Content Actions

```html
<!-- Article interactions -->
<button data-agent-action="share-article" data-agent-article-id="article-456">
  Share Article
</button>

<button
  data-agent-action="bookmark-article"
  data-agent-article-id="article-456"
>
  Bookmark
</button>

<button data-agent-action="print-article" data-agent-article-id="article-456">
  Print Article
</button>

<!-- Content filtering -->
<select data-agent-action="filter-content" data-agent-filter-type="category">
  <option value="all">All Categories</option>
  <option value="tech">Technology</option>
  <option value="business">Business</option>
</select>

<!-- Pagination -->
<a data-agent-action="next-page" data-agent-page="2" href="/articles?page=2">
  Next Page
</a>
```

### Content Attributes

#### Content Labeling

```html
<!-- Page structure -->
<h1 data-agent-content="page-title">Product Catalog</h1>
<p data-agent-content="page-description">Browse our complete product range</p>

<!-- Section structure -->
<h2 data-agent-content="section-title">Featured Products</h2>
<p data-agent-content="section-description">Our most popular items</p>

<!-- Data labeling -->
<span data-agent-content="product-name">Wireless Headphones</span>
<span data-agent-content="product-price">$199.99</span>
<span data-agent-content="product-rating">4.5/5 stars</span>

<!-- Status indicators -->
<span data-agent-content="availability-status">In Stock</span>
<span data-agent-content="shipping-info">Free shipping available</span>

<!-- Help text -->
<small data-agent-content="field-help">Your email will not be shared</small>
<div data-agent-content="error-message">Please enter a valid email address</div>
```

#### Content Types

| Content Type          | Usage                | Example                                        |
| --------------------- | -------------------- | ---------------------------------------------- |
| `page-title`          | Main page heading    | `<h1 data-agent-content="page-title">`         |
| `page-description`    | Page summary         | `<p data-agent-content="page-description">`    |
| `section-title`       | Section heading      | `<h2 data-agent-content="section-title">`      |
| `section-description` | Section summary      | `<p data-agent-content="section-description">` |
| `product-name`        | Product title        | `<span data-agent-content="product-name">`     |
| `product-price`       | Price information    | `<span data-agent-content="product-price">`    |
| `product-rating`      | Rating/review data   | `<span data-agent-content="product-rating">`   |
| `field-label`         | Form field label     | `<label data-agent-content="field-label">`     |
| `field-help`          | Help text            | `<small data-agent-content="field-help">`      |
| `error-message`       | Error information    | `<div data-agent-content="error-message">`     |
| `success-message`     | Success notification | `<div data-agent-content="success-message">`   |

### Field Attributes

#### Form Field Types

```html
<!-- Customer information -->
<input data-agent-field="customer-name" type="text" name="name" />
<input data-agent-field="customer-email" type="email" name="email" />
<input data-agent-field="customer-phone" type="tel" name="phone" />

<!-- Address information -->
<input data-agent-field="billing-address-street" type="text" name="street" />
<input data-agent-field="billing-address-city" type="text" name="city" />
<select data-agent-field="billing-address-state" name="state">
  <input data-agent-field="billing-address-zip" type="text" name="zip" />

  <!-- Product selection -->
  <select data-agent-field="product-category" name="category">
    <input data-agent-field="product-quantity" type="number" name="quantity" />
    <input data-agent-field="product-search-query" type="search" name="q" />

    <!-- Payment information -->
    <input
      data-agent-field="payment-card-number"
      type="text"
      name="card_number"
    />
    <select data-agent-field="payment-card-expiry-month" name="exp_month">
      <select data-agent-field="payment-card-expiry-year" name="exp_year">
        <input data-agent-field="payment-card-cvv" type="text" name="cvv" />

        <!-- Communication preferences -->
        <input
          data-agent-field="newsletter-subscription"
          type="checkbox"
          name="newsletter"
        />
        <textarea data-agent-field="customer-message" name="message"></textarea>
        <select data-agent-field="inquiry-type" name="subject"></select>
      </select>
    </select>
  </select>
</select>
```

#### Field Validation

```html
<input
  data-agent-field="customer-email"
  data-agent-validation="required|email|max:255"
  data-agent-error-target="email-error"
  type="email"
  name="email"
  required
  aria-describedby="email-error"
/>
<div id="email-error" data-agent-content="error-message" role="alert"></div>
```

**Validation Types:**

- `required` - Field is mandatory
- `email` - Must be valid email format
- `phone` - Must be valid phone number
- `url` - Must be valid URL
- `min:n` - Minimum length/value
- `max:n` - Maximum length/value
- `pattern:regex` - Custom regex pattern
- `numeric` - Must be numeric
- `alpha` - Must be alphabetic
- `alphanumeric` - Must be alphanumeric

## Structured Data Schemas

### Product Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "image": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  "sku": "PROD-123",
  "mpn": "MPN-456",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "category": "Electronics > Audio > Headphones",
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/123",
    "priceCurrency": "USD",
    "price": "199.99",
    "priceValidUntil": "2024-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {
      "@type": "Organization",
      "name": "Your Store Name"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0.00",
        "currency": "USD"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "businessDays": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        },
        "cutoffTime": "16:00",
        "handlingTime": {
          "@type": "QuantitativeValue",
          "minValue": 1,
          "maxValue": 2,
          "unitCode": "DAY"
        }
      }
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "John Doe"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Excellent product quality and fast shipping."
    }
  ]
}
```

### Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Headline",
  "description": "Article description or excerpt",
  "image": "https://example.com/article-image.jpg",
  "datePublished": "2024-01-15T09:00:00Z",
  "dateModified": "2024-01-16T10:30:00Z",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/authors/author-name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Publisher Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png",
      "width": 200,
      "height": 60
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/articles/article-slug"
  },
  "articleSection": "Technology",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "wordCount": 1250,
  "timeRequired": "PT5M"
}
```

### Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "description": "Company description",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Spanish"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Business Street",
    "addressLocality": "Business City",
    "addressRegion": "State",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://facebook.com/company",
    "https://twitter.com/company",
    "https://linkedin.com/company/company"
  ]
}
```

### WebSite Schema

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Website Name",
  "description": "Website description",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Company Name"
  }
}
```

### FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is your return policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a 30-day return policy for all unused items in original packaging."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer international shipping?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we ship to over 50 countries worldwide. Shipping costs vary by destination."
      }
    }
  ]
}
```

## HTTP Headers and Meta Tags

### Agent Detection Headers

#### Request Headers (Incoming)

```http
User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
From: googlebot(at)googlebot.com
```

#### Response Headers (Outgoing)

```http
X-Agent-Optimized: true
X-Agent-Framework: agentux/2.1.0
X-Agent-Rendering: ssr
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Cache-Control: public, max-age=3600
Vary: User-Agent
```

### Meta Tags

#### Essential Meta Tags

```html
<head>
  <!-- Basic meta tags -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta
    name="description"
    content="Page description for search engines and agents"
  />
  <meta name="keywords" content="keyword1, keyword2, keyword3" />
  <meta name="robots" content="index, follow" />

  <!-- Agent-specific meta tags -->
  <meta name="agent-page" content="product-catalog" />
  <meta name="agent-intent" content="browse-products" />
  <meta name="agent-framework" content="next.js" />
  <meta name="agent-version" content="2.1.0" />

  <!-- Open Graph for social media agents -->
  <meta property="og:title" content="Page Title" />
  <meta property="og:description" content="Page description" />
  <meta property="og:image" content="https://example.com/image.jpg" />
  <meta property="og:url" content="https://example.com/current-page" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Site Name" />

  <!-- Twitter Card for Twitter agents -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Page Title" />
  <meta name="twitter:description" content="Page description" />
  <meta name="twitter:image" content="https://example.com/image.jpg" />
  <meta name="twitter:site" content="@yourusername" />

  <!-- Canonical URL for search engines -->
  <link rel="canonical" href="https://example.com/current-page" />

  <!-- Preload critical resources for agents -->
  <link rel="preload" href="/critical.css" as="style" />
  <link rel="preload" href="/api/products" as="fetch" crossorigin="anonymous" />
</head>
```

#### E-commerce Meta Tags

```html
<!-- Product-specific meta tags -->
<meta name="product:price:amount" content="199.99" />
<meta name="product:price:currency" content="USD" />
<meta name="product:availability" content="in stock" />
<meta name="product:condition" content="new" />
<meta name="product:brand" content="Brand Name" />
<meta name="product:category" content="Electronics" />

<!-- Shopping-specific Open Graph -->
<meta property="product:price:amount" content="199.99" />
<meta property="product:price:currency" content="USD" />
<meta property="og:availability" content="instock" />
<meta property="og:condition" content="new" />
```

#### Article Meta Tags

```html
<!-- Article-specific meta tags -->
<meta name="article:author" content="Author Name" />
<meta name="article:published_time" content="2024-01-15T09:00:00Z" />
<meta name="article:modified_time" content="2024-01-16T10:30:00Z" />
<meta name="article:section" content="Technology" />
<meta name="article:tag" content="web development" />
<meta name="article:tag" content="accessibility" />

<!-- Open Graph for articles -->
<meta property="og:type" content="article" />
<meta
  property="article:author"
  content="https://example.com/authors/author-name"
/>
<meta property="article:published_time" content="2024-01-15T09:00:00Z" />
<meta property="article:modified_time" content="2024-01-16T10:30:00Z" />
<meta property="article:section" content="Technology" />
<meta property="article:tag" content="web development" />
```

## JavaScript Detection API

### Agent Detection Function

```javascript
/**
 * BiModal Design Detection Library
 * Detects and categorizes user agents for optimal experience delivery
 */

class BiModalDesignDetector {
  constructor(config = {}) {
    this.config = {
      enableAnalytics: config.enableAnalytics ?? true,
      customPatterns: config.customPatterns ?? {},
      strictMode: config.strictMode ?? false,
      ...config,
    };

    this.agentInfo = null;
    this.capabilities = null;
  }

  /**
   * Detect agent type and capabilities
   * @param {string} userAgent - User agent string (optional, uses navigator.userAgent if not provided)
   * @returns {AgentInfo} Agent detection results
   */
  detect(userAgent = navigator.userAgent) {
    const detection = this.analyzeUserAgent(userAgent);
    const capabilities = this.detectCapabilities();

    this.agentInfo = {
      ...detection,
      capabilities,
      timestamp: new Date().toISOString(),
      sessionId: this.generateSessionId(),
    };

    if (this.config.enableAnalytics) {
      this.trackDetection(this.agentInfo);
    }

    return this.agentInfo;
  }

  /**
   * Analyze user agent string for patterns
   * @private
   */
  analyzeUserAgent(userAgent) {
    const patterns = {
      // Search engine bots
      search: [
        { pattern: /googlebot/i, name: 'GoogleBot', vendor: 'Google' },
        { pattern: /bingbot/i, name: 'BingBot', vendor: 'Microsoft' },
        { pattern: /slurp/i, name: 'Yahoo Slurp', vendor: 'Yahoo' },
        { pattern: /duckduckbot/i, name: 'DuckDuckBot', vendor: 'DuckDuckGo' },
        { pattern: /baiduspider/i, name: 'Baidu Spider', vendor: 'Baidu' },
        { pattern: /yandexbot/i, name: 'YandexBot', vendor: 'Yandex' },
      ],

      // Social media bots
      social: [
        {
          pattern: /facebookexternalhit/i,
          name: 'Facebook Bot',
          vendor: 'Meta',
        },
        { pattern: /twitterbot/i, name: 'TwitterBot', vendor: 'Twitter' },
        { pattern: /linkedinbot/i, name: 'LinkedInBot', vendor: 'LinkedIn' },
        { pattern: /whatsapp/i, name: 'WhatsApp Bot', vendor: 'Meta' },
        { pattern: /telegrambot/i, name: 'Telegram Bot', vendor: 'Telegram' },
      ],

      // Shopping and comparison bots
      shopping: [
        { pattern: /shopping/i, name: 'Shopping Bot', vendor: 'Generic' },
        { pattern: /price/i, name: 'Price Comparison', vendor: 'Generic' },
        { pattern: /comparison/i, name: 'Comparison Bot', vendor: 'Generic' },
        { pattern: /pronto/i, name: 'Pronto', vendor: 'Pronto' },
      ],

      // Automation and testing tools
      automation: [
        { pattern: /headless/i, name: 'Headless Browser', vendor: 'Generic' },
        { pattern: /selenium/i, name: 'Selenium', vendor: 'Selenium' },
        { pattern: /playwright/i, name: 'Playwright', vendor: 'Microsoft' },
        { pattern: /puppeteer/i, name: 'Puppeteer', vendor: 'Google' },
        { pattern: /cypress/i, name: 'Cypress', vendor: 'Cypress' },
      ],

      // Command line tools
      cli: [
        { pattern: /curl/i, name: 'cURL', vendor: 'cURL' },
        { pattern: /wget/i, name: 'Wget', vendor: 'GNU' },
        { pattern: /httpie/i, name: 'HTTPie', vendor: 'HTTPie' },
        { pattern: /postman/i, name: 'Postman', vendor: 'Postman' },
      ],

      // Generic bots
      generic: [
        { pattern: /bot/i, name: 'Generic Bot', vendor: 'Unknown' },
        { pattern: /crawler/i, name: 'Generic Crawler', vendor: 'Unknown' },
        { pattern: /spider/i, name: 'Generic Spider', vendor: 'Unknown' },
      ],

      // Custom patterns from config
      ...this.config.customPatterns,
    };

    // Find matching pattern
    for (const [category, categoryPatterns] of Object.entries(patterns)) {
      for (const { pattern, name, vendor } of categoryPatterns) {
        if (pattern.test(userAgent)) {
          return {
            isAgent: true,
            category,
            name,
            vendor,
            userAgent,
            confidence: this.calculateConfidence(userAgent, pattern),
          };
        }
      }
    }

    // No agent pattern matched
    return {
      isAgent: false,
      category: 'human',
      name: 'Human User',
      vendor: 'Browser',
      userAgent,
      confidence: 0.95,
    };
  }

  /**
   * Detect browser/agent capabilities
   * @private
   */
  detectCapabilities() {
    if (typeof window === 'undefined') {
      return { environment: 'server' };
    }

    return {
      environment: 'browser',
      javascript: true,
      cookies: navigator.cookieEnabled || false,
      localStorage: this.testLocalStorage(),
      sessionStorage: this.testSessionStorage(),
      indexedDB: 'indexedDB' in window,
      webGL: this.testWebGL(),
      canvas: this.testCanvas(),
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      webRTC: this.testWebRTC(),
      mediaDevices: 'mediaDevices' in navigator,
      touchSupport: 'ontouchstart' in window,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1,
      },
      connection: this.getConnectionInfo(),
      memory: navigator.deviceMemory || null,
      cores: navigator.hardwareConcurrency || null,
    };
  }

  /**
   * Test localStorage availability
   * @private
   */
  testLocalStorage() {
    try {
      const test = 'agentux_test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Test sessionStorage availability
   * @private
   */
  testSessionStorage() {
    try {
      const test = 'agentux_test';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Test WebGL support
   * @private
   */
  testWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * Test Canvas support
   * @private
   */
  testCanvas() {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    } catch (e) {
      return false;
    }
  }

  /**
   * Test WebRTC support
   * @private
   */
  testWebRTC() {
    return !!(
      window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection
    );
  }

  /**
   * Get connection information
   * @private
   */
  getConnectionInfo() {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    return connection
      ? {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        }
      : null;
  }

  /**
   * Calculate confidence score for agent detection
   * @private
   */
  calculateConfidence(userAgent, pattern) {
    const length = userAgent.length;
    const matches = userAgent.match(pattern);

    // Base confidence on pattern specificity and user agent completeness
    let confidence = 0.8;

    if (matches && matches[0].length > 10) confidence += 0.1;
    if (length > 50) confidence += 0.05;
    if (length < 20) confidence -= 0.2;

    return Math.min(0.99, Math.max(0.1, confidence));
  }

  /**
   * Generate unique session ID
   * @private
   */
  generateSessionId() {
    return (
      'agentux_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    );
  }

  /**
   * Track agent detection for analytics
   * @private
   */
  trackDetection(agentInfo) {
    if (typeof window !== 'undefined' && window.fetch) {
      fetch('/api/agentux/detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentInfo),
      }).catch(() => {}); // Silent fail for analytics
    }
  }

  /**
   * Get agent preferences based on detection
   * @returns {AgentPreferences} Recommended preferences for detected agent
   */
  getPreferences() {
    if (!this.agentInfo) {
      throw new Error('Must call detect() first');
    }

    const preferences = {
      preferStatic: false,
      preferTraditionalNav: false,
      preferSimpleUI: false,
      preferStructuredData: true,
      enhanceSemantics: true,
      disableAnimations: false,
      prioritizePerformance: false,
    };

    switch (this.agentInfo.category) {
      case 'search':
        preferences.preferStatic = true;
        preferences.preferTraditionalNav = true;
        preferences.preferSimpleUI = true;
        preferences.disableAnimations = true;
        preferences.prioritizePerformance = true;
        break;

      case 'social':
        preferences.preferStatic = true;
        preferences.preferTraditionalNav = true;
        preferences.enhanceSemantics = true;
        break;

      case 'shopping':
        preferences.preferStructuredData = true;
        preferences.enhanceSemantics = true;
        preferences.prioritizePerformance = true;
        break;

      case 'cli':
        preferences.preferStatic = true;
        preferences.preferTraditionalNav = true;
        preferences.preferSimpleUI = true;
        preferences.disableAnimations = true;
        break;

      case 'automation':
        preferences.preferTraditionalNav = false; // Can handle SPAs
        preferences.enhanceSemantics = true;
        break;

      default:
        // Keep defaults for unknown agents
        break;
    }

    // Override based on capabilities
    if (!this.agentInfo.capabilities.javascript) {
      preferences.preferStatic = true;
      preferences.preferTraditionalNav = true;
      preferences.preferSimpleUI = true;
    }

    return preferences;
  }

  /**
   * Apply agent-specific enhancements to the page
   * @param {AgentPreferences} customPreferences - Override default preferences
   */
  enhance(customPreferences = {}) {
    if (!this.agentInfo?.isAgent) return;

    const preferences = { ...this.getPreferences(), ...customPreferences };

    // Apply document-level attributes
    document.documentElement.setAttribute('data-agent-context', 'detected');
    document.documentElement.setAttribute(
      'data-agent-type',
      this.agentInfo.name
    );
    document.documentElement.setAttribute(
      'data-agent-category',
      this.agentInfo.category
    );

    // Apply performance optimizations
    if (preferences.disableAnimations) {
      this.disableAnimations();
    }

    if (preferences.enhanceSemantics) {
      this.enhanceSemantics();
    }

    if (preferences.preferSimpleUI) {
      this.simplifyUI();
    }

    // Add navigation aids
    this.addNavigationAids(preferences);
  }

  /**
   * Disable animations for performance
   * @private
   */
  disableAnimations() {
    const style = document.createElement('style');
    style.id = 'agentux-animations';
    style.textContent = `
      [data-agent-context="detected"] *,
      [data-agent-context="detected"] *::before,
      [data-agent-context="detected"] *::after {
        animation-duration: 0.01ms !important;
        animation-delay: -0.01ms !important;
        transition-duration: 0.01ms !important;
        transition-delay: -0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Enhance semantic markup
   * @private
   */
  enhanceSemantics() {
    // Add missing ARIA labels
    const buttons = document.querySelectorAll(
      'button:not([aria-label]):not([aria-labelledby])'
    );
    buttons.forEach((button) => {
      const text = button.textContent.trim();
      if (text) {
        button.setAttribute('aria-label', text);
      }
    });

    // Enhance form fields
    const inputs = document.querySelectorAll(
      'input:not([aria-label]):not([aria-labelledby])'
    );
    inputs.forEach((input) => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label && !input.hasAttribute('aria-label')) {
        input.setAttribute(
          'aria-labelledby',
          label.id || this.generateId('label')
        );
      }
    });

    // Add agent-specific attributes to interactive elements
    this.addAgentAttributes();
  }

  /**
   * Add agent-specific attributes to elements
   * @private
   */
  addAgentAttributes() {
    // Add action attributes to buttons
    const buttons = document.querySelectorAll(
      'button:not([data-agent-action])'
    );
    buttons.forEach((button) => {
      const text = button.textContent.toLowerCase();
      let action = 'button-click';

      if (text.includes('submit') || text.includes('send'))
        action = 'submit-form';
      else if (text.includes('search')) action = 'perform-search';
      else if (text.includes('buy') || text.includes('purchase'))
        action = 'initiate-purchase';
      else if (text.includes('add') && text.includes('cart'))
        action = 'add-to-cart';
      else if (text.includes('contact') || text.includes('support'))
        action = 'get-support';

      button.setAttribute('data-agent-action', action);
    });

    // Add navigation attributes to links
    const links = document.querySelectorAll('a:not([data-agent-action])');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      const text = link.textContent.toLowerCase();
      let action = 'navigate';

      if (href === '/' || text.includes('home')) action = 'go-home';
      else if (href?.includes('product') || text.includes('product'))
        action = 'view-products';
      else if (href?.includes('contact') || text.includes('contact'))
        action = 'get-support';
      else if (href?.includes('about') || text.includes('about'))
        action = 'view-about';

      link.setAttribute('data-agent-action', action);
    });
  }

  /**
   * Simplify UI for better agent parsing
   * @private
   */
  simplifyUI() {
    const style = document.createElement('style');
    style.id = 'agentux-simplify';
    style.textContent = `
      [data-agent-context="detected"] {
        font-size: 16px !important;
        line-height: 1.6 !important;
      }
      [data-agent-context="detected"] * {
        box-shadow: none !important;
        text-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Add navigation aids for agents
   * @private
   */
  addNavigationAids(preferences) {
    // Add skip links if not present
    if (!document.querySelector('.agentux-skip-link')) {
      this.addSkipLinks();
    }

    // Add breadcrumbs if appropriate
    if (
      preferences.preferTraditionalNav &&
      !document.querySelector('[data-agentux-breadcrumbs]')
    ) {
      this.addBreadcrumbs();
    }
  }

  /**
   * Add skip links for accessibility
   * @private
   */
  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'agentux-skip-link';
    skipLink.setAttribute('data-agent-action', 'skip-to-content');

    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      font-size: 14px;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * Add breadcrumb navigation
   * @private
   */
  addBreadcrumbs() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);

    if (segments.length === 0) return;

    const nav =
      document.querySelector('nav') || document.querySelector('header');
    if (!nav) return;

    const breadcrumbs = document.createElement('nav');
    breadcrumbs.setAttribute('aria-label', 'Breadcrumb');
    breadcrumbs.setAttribute('data-agentux-breadcrumbs', 'true');
    breadcrumbs.className = 'agentux-breadcrumbs';

    let breadcrumbHTML =
      '<ol style="display: flex; gap: 0.5rem; margin: 0; padding: 0.5rem; list-style: none; font-size: 0.875rem;">';
    breadcrumbHTML +=
      '<li><a href="/" data-agent-action="go-home">Home</a></li>';

    segments.forEach((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      const isLast = index === segments.length - 1;
      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

      breadcrumbHTML += '<li><span aria-hidden="true"> › </span>';

      if (isLast) {
        breadcrumbHTML += `<span aria-current="page" data-agent-content="current-page">${label}</span>`;
      } else {
        breadcrumbHTML += `<a href="${path}" data-agent-action="navigate-to-${segment}">${label}</a>`;
      }

      breadcrumbHTML += '</li>';
    });

    breadcrumbHTML += '</ol>';
    breadcrumbs.innerHTML = breadcrumbHTML;

    nav.appendChild(breadcrumbs);
  }

  /**
   * Generate unique ID for elements
   * @private
   */
  generateId(prefix = 'agentux') {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Usage Examples
const agentDetector = new BiModalDesignDetector({
  enableAnalytics: true,
  customPatterns: {
    'custom-bots': [
      { pattern: /mycompanybot/i, name: 'Company Bot', vendor: 'My Company' },
    ],
  },
});

// Detect agent
const agentInfo = agentDetector.detect();

// Apply enhancements if agent detected
if (agentInfo.isAgent) {
  agentDetector.enhance();
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BiModalDesignDetector;
}

// Global access for direct script inclusion
if (typeof window !== 'undefined') {
  window.BiModalDesignDetector = BiModalDesignDetector;
}
```

### Enhancement API

```javascript
/**
 * BiModal Design Enhancement Utilities
 * Additional utilities for enhancing pages for agents
 */

class BiModalDesignEnhancer {
  constructor(detector) {
    this.detector = detector;
    this.enhancements = new Set();
  }

  /**
   * Enhance forms for better agent accessibility
   * @param {string} selector - Form selector (default: 'form')
   */
  enhanceForms(selector = 'form') {
    const forms = document.querySelectorAll(selector);

    forms.forEach((form) => {
      if (this.enhancements.has(form)) return;

      // Add form-level attributes
      if (!form.hasAttribute('data-agent-component')) {
        form.setAttribute('data-agent-component', 'form');
      }

      // Enhance fieldsets
      const fieldsets = form.querySelectorAll('fieldset');
      fieldsets.forEach((fieldset, index) => {
        if (!fieldset.hasAttribute('data-agent-section')) {
          fieldset.setAttribute('data-agent-section', `section-${index + 1}`);
        }
      });

      // Enhance form fields
      const fields = form.querySelectorAll('input, select, textarea');
      fields.forEach((field) => {
        this.enhanceFormField(field);
      });

      // Enhance submit buttons
      const submitButtons = form.querySelectorAll('[type="submit"]');
      submitButtons.forEach((button) => {
        if (!button.hasAttribute('data-agent-action')) {
          button.setAttribute('data-agent-action', 'submit-form');
        }
      });

      this.enhancements.add(form);
    });
  }

  /**
   * Enhance individual form field
   * @private
   */
  enhanceFormField(field) {
    // Add field type attribute
    if (!field.hasAttribute('data-agent-field')) {
      const fieldType = this.inferFieldType(field);
      field.setAttribute('data-agent-field', fieldType);
    }

    // Add validation attributes
    if (
      field.hasAttribute('required') &&
      !field.hasAttribute('data-agent-validation')
    ) {
      field.setAttribute('data-agent-validation', 'required');
    }

    // Enhance labels
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label && !label.hasAttribute('data-agent-content')) {
      label.setAttribute('data-agent-content', 'field-label');
    }
  }

  /**
   * Infer field type from element
   * @private
   */
  inferFieldType(field) {
    const name = field.name?.toLowerCase() || '';
    const id = field.id?.toLowerCase() || '';
    const placeholder = field.placeholder?.toLowerCase() || '';
    const label =
      document
        .querySelector(`label[for="${field.id}"]`)
        ?.textContent?.toLowerCase() || '';

    const text = `${name} ${id} ${placeholder} ${label}`;

    // Common field types
    if (/email/.test(text)) return 'customer-email';
    if (/name/.test(text) && !/user/.test(text)) return 'customer-name';
    if (/phone|tel/.test(text)) return 'customer-phone';
    if (/address/.test(text)) return 'customer-address';
    if (/city/.test(text)) return 'address-city';
    if (/state|region/.test(text)) return 'address-state';
    if (/zip|postal/.test(text)) return 'address-zip';
    if (/country/.test(text)) return 'address-country';
    if (/message|comment/.test(text)) return 'customer-message';
    if (/subject/.test(text)) return 'inquiry-subject';
    if (/company|organization/.test(text)) return 'customer-company';
    if (/quantity/.test(text)) return 'product-quantity';
    if (/search/.test(text)) return 'search-query';

    return 'user-input';
  }

  /**
   * Enhance navigation elements
   * @param {string} selector - Navigation selector (default: 'nav')
   */
  enhanceNavigation(selector = 'nav') {
    const navs = document.querySelectorAll(selector);

    navs.forEach((nav) => {
      if (this.enhancements.has(nav)) return;

      // Add navigation component attribute
      if (!nav.hasAttribute('data-agent-component')) {
        nav.setAttribute('data-agent-component', 'navigation');
      }

      // Enhance navigation links
      const links = nav.querySelectorAll('a');
      links.forEach((link) => {
        if (!link.hasAttribute('data-agent-action')) {
          const action = this.inferLinkAction(link);
          link.setAttribute('data-agent-action', action);
        }
      });

      this.enhancements.add(nav);
    });
  }

  /**
   * Infer link action from element
   * @private
   */
  inferLinkAction(link) {
    const href = link.getAttribute('href')?.toLowerCase() || '';
    const text = link.textContent?.toLowerCase() || '';

    if (href === '/' || text.includes('home')) return 'go-home';
    if (href.includes('product') || text.includes('product'))
      return 'view-products';
    if (href.includes('contact') || text.includes('contact'))
      return 'get-support';
    if (href.includes('about') || text.includes('about')) return 'view-about';
    if (href.includes('cart') || text.includes('cart')) return 'view-cart';
    if (href.includes('checkout') || text.includes('checkout'))
      return 'proceed-checkout';
    if (href.includes('login') || text.includes('login')) return 'user-login';
    if (href.includes('register') || text.includes('register'))
      return 'user-register';

    return 'navigate';
  }

  /**
   * Add structured data to page
   * @param {Object} data - Structured data object
   * @param {string} id - Script element ID (optional)
   */
  addStructuredData(data, id = null) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);

    if (id) {
      script.id = id;
    }

    document.head.appendChild(script);
  }

  /**
   * Enhance images with proper alt text and structured data
   * @param {string} selector - Image selector (default: 'img')
   */
  enhanceImages(selector = 'img') {
    const images = document.querySelectorAll(selector);

    images.forEach((img) => {
      if (this.enhancements.has(img)) return;

      // Ensure alt text exists
      if (!img.hasAttribute('alt')) {
        // Try to infer from context
        const figcaption = img.closest('figure')?.querySelector('figcaption');
        const title = img.getAttribute('title');

        if (figcaption) {
          img.setAttribute('alt', figcaption.textContent.trim());
        } else if (title) {
          img.setAttribute('alt', title);
        } else {
          img.setAttribute('alt', 'Image'); // Fallback
        }
      }

      // Add agent attributes for product images
      if (img.closest('[data-agent-component="product-card"]')) {
        img.setAttribute('data-agent-content', 'product-image');
      }

      this.enhancements.add(img);
    });
  }

  /**
   * Enhance tables with proper headers and structure
   * @param {string} selector - Table selector (default: 'table')
   */
  enhanceTables(selector = 'table') {
    const tables = document.querySelectorAll(selector);

    tables.forEach((table) => {
      if (this.enhancements.has(table)) return;

      // Add table component attribute
      if (!table.hasAttribute('data-agent-component')) {
        table.setAttribute('data-agent-component', 'data-table');
      }

      // Enhance headers
      const headers = table.querySelectorAll('th');
      headers.forEach((header) => {
        if (!header.hasAttribute('data-agent-content')) {
          header.setAttribute('data-agent-content', 'table-header');
        }

        // Add scope if not present
        if (!header.hasAttribute('scope')) {
          header.setAttribute('scope', 'col');
        }
      });

      // Add caption if missing
      if (
        !table.querySelector('caption') &&
        table.previousElementSibling?.tagName === 'H2'
      ) {
        const caption = document.createElement('caption');
        caption.textContent = table.previousElementSibling.textContent;
        table.insertBefore(caption, table.firstChild);
      }

      this.enhancements.add(table);
    });
  }

  /**
   * Monitor for dynamically added content
   */
  startMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Re-enhance new content
            this.enhanceForms();
            this.enhanceNavigation();
            this.enhanceImages();
            this.enhanceTables();
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return observer;
  }
}

// Usage
const enhancer = new BiModalDesignEnhancer(agentDetector);

// Enhance specific elements
enhancer.enhanceForms();
enhancer.enhanceNavigation();
enhancer.enhanceImages();
enhancer.enhanceTables();

// Start monitoring for dynamic content
enhancer.startMutationObserver();
```

## CSS Classes and Selectors

### Agent-Specific CSS Classes

```css
/* Base agent context styles */
[data-agent-context='detected'] {
  /* Apply agent-optimized styles */
  font-size: 16px;
  line-height: 1.6;
  color-scheme: light;
}

/* Performance optimizations for agents */
[data-agent-context='detected'] * {
  /* Disable animations for faster parsing */
  animation-duration: 0.01ms !important;
  animation-delay: -0.01ms !important;
  transition-duration: 0.01ms !important;
  transition-delay: -0.01ms !important;
}

/* Agent category-specific styles */
[data-agent-category='search'] {
  /* Search engine optimizations */
  background: white;
  color: black;
}

[data-agent-category='social'] {
  /* Social media preview optimizations */
  max-width: 1200px;
  margin: 0 auto;
}

[data-agent-category='shopping'] {
  /* Shopping bot optimizations */
  .product-price {
    font-size: 1.5em;
    font-weight: bold;
    color: #e74c3c;
  }
}

/* Component-specific styles */
[data-agent-component='navigation'] {
  /* Enhanced navigation for agents */
  border-bottom: 2px solid #ccc;
  background: #f8f9fa;
}

[data-agent-component='product-card'] {
  /* Product card optimizations */
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
}

[data-agent-component='form'] {
  /* Form optimizations */
  max-width: 600px;
  margin: 0 auto;
}

[data-agent-component='form'] fieldset {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
}

/* Content-specific styles */
[data-agent-content='page-title'] {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

[data-agent-content='section-title'] {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #555;
}

[data-agent-content='product-price'] {
  font-size: 1.25rem;
  font-weight: bold;
  color: #e74c3c;
}

/* Action element styles */
[data-agent-action] {
  /* All actionable elements */
  cursor: pointer;
  outline-offset: 2px;
}

[data-agent-action]:focus-visible {
  outline: 2px solid #007bff;
}

/* Utility classes for agent optimization */
.agentux-hidden {
  display: none;
}

.agentux-visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

.agentux-skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 10000;
}

.agentux-skip-link:focus {
  top: 6px;
}

/* Print styles for CLI agents */
@media print {
  [data-agent-context='detected'] {
    background: white !important;
    color: black !important;
  }

  [data-agent-action]::after {
    content: ' [' attr(data-agent-action) ']';
    font-size: 0.8em;
    color: #666;
  }
}

/* High contrast mode for accessibility agents */
@media (prefers-contrast: high) {
  [data-agent-context='detected'] {
    background: white;
    color: black;
  }

  [data-agent-component] {
    border: 2px solid black;
  }
}

/* Reduced motion for agents that prefer minimal animations */
@media (prefers-reduced-motion: reduce) {
  [data-agent-context='detected'] * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Responsive Styles for Agents

```css
/* Mobile agent optimizations */
@media (max-width: 768px) {
  [data-agent-context='detected'] {
    font-size: 18px; /* Larger text for mobile agents */
  }

  [data-agent-component='navigation'] {
    /* Stack navigation for mobile agents */
    flex-direction: column;
  }

  [data-agent-component='product-card'] {
    /* Full width on mobile */
    width: 100%;
    margin-bottom: 2rem;
  }
}

/* Large screen agent optimizations */
@media (min-width: 1200px) {
  [data-agent-context='detected'] {
    max-width: 1200px;
    margin: 0 auto;
  }

  [data-agent-component='product-list'] {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
}
```

## Server-Side Implementation

### Node.js/Express Agent Detection

```javascript
/**
 * BiModal Design Server-Side Implementation
 * Express.js middleware for agent detection and routing
 */

const BiModal DesignServer = {
  // Agent detection patterns
  patterns: {
    search: [
      /googlebot/i,
      /bingbot/i,
      /slurp/i,
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i,
    ],
    social: [
      /facebookexternalhit/i,
      /twitterbot/i,
      /linkedinbot/i,
      /whatsapp/i,
      /telegrambot/i,
    ],
    shopping: [/shopping/i, /price/i, /comparison/i, /pronto/i],
    automation: [
      /headless/i,
      /selenium/i,
      /playwright/i,
      /puppeteer/i,
      /cypress/i,
    ],
    cli: [/curl/i, /wget/i, /httpie/i, /postman/i],
  },

  /**
   * Express middleware for agent detection
   */
  middleware() {
    return (req, res, next) => {
      const userAgent = req.get('User-Agent') || '';
      const detection = this.detectAgent(userAgent);

      // Add agent info to request
      req.agent = detection;

      // Add response headers
      if (detection.isAgent) {
        res.set('X-Agent-Detected', 'true');
        res.set('X-Agent-Category', detection.category);
        res.set('X-Agent-Name', detection.name);
      }

      next();
    };
  },

  /**
   * Detect agent from user agent string
   */
  detectAgent(userAgent) {
    for (const [category, patterns] of Object.entries(this.patterns)) {
      for (const pattern of patterns) {
        if (pattern.test(userAgent)) {
          return {
            isAgent: true,
            category,
            name: this.extractAgentName(userAgent, pattern),
            userAgent,
            timestamp: new Date().toISOString(),
          };
        }
      }
    }

    // Check for generic bot patterns
    if (/bot|crawler|spider/i.test(userAgent)) {
      return {
        isAgent: true,
        category: 'generic',
        name: 'Generic Bot',
        userAgent,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      isAgent: false,
      category: 'human',
      name: 'Human User',
      userAgent,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Extract agent name from user agent
   */
  extractAgentName(userAgent, pattern) {
    const match = userAgent.match(pattern);
    if (match) {
      return match[0];
    }
    return 'Unknown Agent';
  },

  /**
   * Route handler for agent-optimized content
   */
  agentRoute(options = {}) {
    return (req, res, next) => {
      if (!req.agent?.isAgent) {
        return next();
      }

      const { renderSSR, redirectToStatic, customHandler } = options;

      if (customHandler) {
        return customHandler(req, res, next);
      }

      if (redirectToStatic) {
        const staticPath = this.getStaticPath(req.path);
        return res.redirect(302, staticPath);
      }

      if (renderSSR) {
        return this.renderSSRContent(req, res, renderSSR);
      }

      next();
    };
  },

  /**
   * Get static path for agent content
   */
  getStaticPath(originalPath) {
    // Map dynamic routes to static equivalents
    const staticRoutes = {
      '/': '/static/index.html',
      '/products': '/static/products.html',
      '/contact': '/static/contact.html',
    };

    return staticRoutes[originalPath] || `/static${originalPath}.html`;
  },

  /**
   * Render SSR content for agents
   */
  async renderSSRContent(req, res, renderFunction) {
    try {
      const html = await renderFunction({
        path: req.path,
        query: req.query,
        agent: req.agent,
        headers: req.headers,
      });

      res.set('Content-Type', 'text/html');
      res.set('X-Rendered-For-Agent', 'true');
      res.send(html);
    } catch (error) {
      console.error('SSR rendering failed:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  /**
   * Analytics middleware for agent tracking
   */
  analytics() {
    return (req, res, next) => {
      if (req.agent?.isAgent) {
        // Log agent visit
        this.logAgentVisit({
          userAgent: req.agent.userAgent,
          category: req.agent.category,
          path: req.path,
          query: req.query,
          ip: req.ip,
          timestamp: new Date().toISOString(),
        });
      }

      next();
    };
  },

  /**
   * Log agent visit for analytics
   */
  logAgentVisit(data) {
    // Implementation depends on your analytics system
    console.log('Agent Visit:', JSON.stringify(data, null, 2));

    // Example: Send to analytics service
    // analytics.track('agent_visit', data);
  },
};

// Usage example
const express = require('express');
const app = express();

// Apply agent detection middleware
app.use(BiModal DesignServer.middleware());
app.use(BiModal DesignServer.analytics());

// Route with agent optimization
app.get(
  '/',
  BiModal DesignServer.agentRoute({
    renderSSR: async ({ path, agent }) => {
      if (agent.isAgent) {
        return await renderAgentOptimizedHome(agent);
      }
      return await renderRegularHome();
    },
  }),
  (req, res) => {
    // Regular route handler for non-agents
    res.sendFile(__dirname + '/public/index.html');
  }
);

async function renderAgentOptimizedHome(agent) {
  return `
<!DOCTYPE html>
<html lang="en" data-agent-framework="express" data-agent-optimized="true">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BiModal Design Store - Home</title>
  <meta name="description" content="Products designed for both humans and AI agents">
  <meta name="agent-category" content="${agent.category}">
  <meta name="agent-name" content="${agent.name}">
</head>
<body data-agent-rendered="ssr">
  <header role="banner">
    <nav data-agent-component="navigation" role="navigation">
      <a href="/" data-agent-action="go-home">Home</a>
      <a href="/products" data-agent-action="view-products">Products</a>
      <a href="/contact" data-agent-action="get-support">Contact</a>
    </nav>
  </header>

  <main role="main" data-agent-component="main-content">
    <h1 data-agent-content="page-title">Welcome to BiModal Design Store</h1>
    <p data-agent-content="page-description">
      Products designed for optimal agent and human experience
    </p>
  </main>
</body>
</html>`;
}

module.exports = BiModal DesignServer;
```

### Next.js Implementation

```javascript
// pages/_app.js - Next.js BiModal Design integration
import { useEffect } from 'react';
import { BiModalDesignDetector } from '../lib/agentux';

function MyApp({ Component, pageProps, agentInfo }) {
  useEffect(() => {
    if (agentInfo?.isAgent) {
      const detector = new BiModalDesignDetector();
      detector.enhance();
    }
  }, [agentInfo]);

  return (
    <div
      data-agent-framework="next.js"
      data-agent-detected={agentInfo?.isAgent}
    >
      <Component {...pageProps} agentInfo={agentInfo} />
    </div>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const { req } = appContext.ctx;

  let agentInfo = null;
  if (req) {
    // Server-side agent detection
    const userAgent = req.headers['user-agent'] || '';
    agentInfo = detectServerSideAgent(userAgent);
  }

  return { agentInfo };
};

function detectServerSideAgent(userAgent) {
  // Simplified server-side detection
  const agentPatterns = [
    /googlebot/i,
    /bingbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /headless/i,
    /selenium/i,
    /playwright/i,
    /puppeteer/i,
    /curl/i,
    /wget/i,
    /bot/i,
    /crawler/i,
    /spider/i,
  ];

  const isAgent = agentPatterns.some((pattern) => pattern.test(userAgent));

  return {
    isAgent,
    userAgent,
    detectedAt: 'server',
  };
}

export default MyApp;
```

```javascript
// pages/api/agentux/detection.js - Analytics endpoint
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const agentData = req.body;

  // Validate agent data
  if (!agentData.userAgent || typeof agentData.isAgent !== 'boolean') {
    return res.status(400).json({ error: 'Invalid agent data' });
  }

  // Log to your analytics system
  console.log('Agent Detection:', {
    ...agentData,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    timestamp: new Date().toISOString(),
  });

  // Store in database if needed
  // await storeAgentDetection(agentData);

  res.status(200).json({ success: true });
}
```

## Testing and Validation APIs

### Agent Compatibility Testing

```javascript
/**
 * BiModal Design Testing Utilities
 * Tools for testing agent compatibility
 */

class BiModal DesignTester {
  constructor(options = {}) {
    this.baseURL = options.baseURL || 'http://localhost:3000';
    this.userAgents = options.userAgents || this.getDefaultUserAgents();
    this.timeout = options.timeout || 10000;
  }

  getDefaultUserAgents() {
    return {
      googlebot:
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      bingbot:
        'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      facebookbot:
        'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      twitterbot: 'Twitterbot/1.0',
      curl: 'curl/7.68.0',
      headless:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/91.0.4472.124 Safari/537.36',
      selenium:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 selenium/3.141.59',
      puppeteer:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/91.0.4472.124 Safari/537.36 puppeteer/10.0.0',
    };
  }

  /**
   * Test page accessibility for all agent types
   */
  async testAllAgents(path = '/') {
    const results = {};

    for (const [agentName, userAgent] of Object.entries(this.userAgents)) {
      try {
        results[agentName] = await this.testSingleAgent(path, userAgent);
      } catch (error) {
        results[agentName] = {
          success: false,
          error: error.message,
        };
      }
    }

    return results;
  }

  /**
   * Test page accessibility for single agent
   */
  async testSingleAgent(path, userAgent) {
    const url = `${this.baseURL}${path}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const analysis = this.analyzeHTML(html, userAgent);

    return {
      success: true,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      analysis,
      performance: {
        responseTime: Date.now() - startTime,
        contentLength: html.length,
      },
    };
  }

  /**
   * Analyze HTML content for agent compatibility
   */
  analyzeHTML(html, userAgent) {
    const analysis = {
      hasContent: false,
      hasNavigation: false,
      hasSemanticMarkup: false,
      hasAgentAttributes: false,
      hasStructuredData: false,
      hasAccessibleForms: false,
      contentQuality: 0,
      issues: [],
    };

    // Check for basic content
    if (
      html.includes('<main') ||
      html.includes('<article') ||
      html.includes('<section')
    ) {
      analysis.hasContent = true;
    } else {
      analysis.issues.push('No main content sections found');
    }

    // Check for navigation
    if (html.includes('<nav') || html.includes('role="navigation"')) {
      analysis.hasNavigation = true;
    } else {
      analysis.issues.push('No navigation found');
    }

    // Check for semantic markup
    const semanticElements = [
      '<header',
      '<nav',
      '<main',
      '<article',
      '<section',
      '<aside',
      '<footer',
    ];
    const semanticCount = semanticElements.reduce((count, element) => {
      return count + (html.includes(element) ? 1 : 0);
    }, 0);

    if (semanticCount >= 3) {
      analysis.hasSemanticMarkup = true;
    } else {
      analysis.issues.push('Insufficient semantic markup');
    }

    // Check for agent-specific attributes
    if (html.includes('data-agent-')) {
      analysis.hasAgentAttributes = true;
    } else {
      analysis.issues.push('No agent-specific attributes found');
    }

    // Check for structured data
    if (html.includes('application/ld+json') || html.includes('itemscope')) {
      analysis.hasStructuredData = true;
    } else {
      analysis.issues.push('No structured data found');
    }

    // Check for accessible forms
    if (html.includes('<form')) {
      const hasFieldsets = html.includes('<fieldset');
      const hasLabels = html.includes('<label');

      if (hasFieldsets && hasLabels) {
        analysis.hasAccessibleForms = true;
      } else {
        analysis.issues.push('Forms lack proper accessibility structure');
      }
    }

    // Calculate content quality score
    const positiveFactors = [
      analysis.hasContent,
      analysis.hasNavigation,
      analysis.hasSemanticMarkup,
      analysis.hasAgentAttributes,
      analysis.hasStructuredData,
      analysis.hasAccessibleForms,
    ].filter(Boolean).length;

    analysis.contentQuality = positiveFactors / 6;

    return analysis;
  }

  /**
   * Validate BiModal Design implementation
   */
  async validateImplementation(paths = ['/']) {
    const validation = {
      overall: {
        score: 0,
        passed: false,
        timestamp: new Date().toISOString(),
      },
      paths: {},
      recommendations: [],
    };

    for (const path of paths) {
      const pathResults = await this.testAllAgents(path);
      validation.paths[path] = pathResults;
    }

    // Calculate overall score
    const allResults = Object.values(validation.paths).flat();
    const successfulTests = allResults.filter(
      (result) => result.success && result.analysis?.contentQuality > 0.7
    );

    validation.overall.score = successfulTests.length / allResults.length;
    validation.overall.passed = validation.overall.score >= 0.8;

    // Generate recommendations
    validation.recommendations = this.generateRecommendations(validation);

    return validation;
  }

  /**
   * Generate recommendations based on test results
   */
  generateRecommendations(validation) {
    const recommendations = [];

    // Analyze common issues across all tests
    const allIssues = [];
    Object.values(validation.paths).forEach((pathResults) => {
      Object.values(pathResults).forEach((result) => {
        if (result.analysis?.issues) {
          allIssues.push(...result.analysis.issues);
        }
      });
    });

    // Count issue frequency
    const issueFrequency = {};
    allIssues.forEach((issue) => {
      issueFrequency[issue] = (issueFrequency[issue] || 0) + 1;
    });

    // Generate recommendations based on most common issues
    Object.entries(issueFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .forEach(([issue, count]) => {
        switch (issue) {
          case 'No main content sections found':
            recommendations.push({
              priority: 'high',
              issue: 'Missing semantic content structure',
              solution:
                'Add <main>, <article>, or <section> elements to structure your content',
            });
            break;
          case 'No agent-specific attributes found':
            recommendations.push({
              priority: 'medium',
              issue: 'Missing BiModal Design attributes',
              solution:
                'Add data-agent-* attributes to key elements for better agent understanding',
            });
            break;
          case 'No structured data found':
            recommendations.push({
              priority: 'medium',
              issue: 'Missing structured data',
              solution: 'Add JSON-LD structured data or microdata markup',
            });
            break;
          default:
            recommendations.push({
              priority: 'low',
              issue,
              solution: 'Review BiModal Design implementation guidelines',
            });
        }
      });

    return recommendations;
  }
}

// Usage example
const tester = new BiModal DesignTester({
  baseURL: 'https://example.com',
  timeout: 15000,
});

// Test specific path
const results = await tester.testAllAgents('/products');

// Validate entire implementation
const validation = await tester.validateImplementation([
  '/',
  '/products',
  '/contact',
]);

console.log('Validation Results:', JSON.stringify(validation, null, 2));
```

### Playwright Test Integration

```javascript
// tests/agentux.spec.js - Playwright test suite
const { test, expect } = require('@playwright/test');

const agentUserAgents = {
  googlebot:
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  bingbot:
    'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  curl: 'curl/7.68.0',
  headless:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 HeadlessChrome/91.0.4472.124',
};

Object.entries(agentUserAgents).forEach(([agentName, userAgent]) => {
  test.describe(`BiModal Design compatibility for ${agentName}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setUserAgent(userAgent);
    });

    test('should load homepage with content', async ({ page }) => {
      await page.goto('/');

      // Check for semantic structure
      const main = await page.$('main[role="main"]');
      expect(main).toBeTruthy();

      // Check for content
      const content = await page.textContent('main');
      expect(content.length).toBeGreaterThan(100);

      // Check for agent attributes
      const agentComponents = await page.$('[data-agent-component]');
      expect(agentComponents.length).toBeGreaterThan(0);
    });

    test('should have accessible navigation', async ({ page }) => {
      await page.goto('/');

      // Check for navigation structure
      const nav = await page.$('nav[role="navigation"]');
      expect(nav).toBeTruthy();

      // Check for agent actions
      const navLinks = await page.$('nav [data-agent-action]');
      expect(navLinks.length).toBeGreaterThan(0);

      // Test navigation functionality
      await page.click('[data-agent-action="view-products"]');
      await page.waitForURL('**/products');
    });

    test('should have structured data', async ({ page }) => {
      await page.goto('/');

      // Check for JSON-LD
      const structuredData = await page.$('script[type="application/ld+json"]');
      expect(structuredData).toBeTruthy();

      if (structuredData) {
        const content = await structuredData.textContent();
        const data = JSON.parse(content);
        expect(data['@context']).toBe('https://schema.org');
      }
    });

    test('should handle forms accessibly', async ({ page }) => {
      await page.goto('/contact');

      // Check for form structure
      const form = await page.$('form[data-agent-component="contact-form"]');
      if (form) {
        // Check for fieldsets
        const fieldsets = await page.$('fieldset');
        expect(fieldsets.length).toBeGreaterThan(0);

        // Check for proper labeling
        const labels = await page.$('label[data-agent-content="field-label"]');
        const inputs = await page.$('input[data-agent-field]');
        expect(labels.length).toBeGreaterThanOrEqual(inputs.length * 0.8);
      }
    });

    test('should load quickly for agents', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');

      // Wait for main content
      await page.waitForSelector('[data-agent-content="page-title"]');
      const loadTime = Date.now() - startTime;

      // Agents should get content quickly
      expect(loadTime).toBeLessThan(2000);
    });
  });
});

// Accessibility-specific tests
test.describe('BiModal Design Accessibility', () => {
  test('should pass WCAG compliance', async ({ page }) => {
    await page.goto('/');

    // Check heading hierarchy
    const headings = await page.$('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);

    // Check for proper alt text on images
    const images = await page.$('img');
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }

    // Check for form labels
    const inputs = await page.$('input, select, textarea');
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        const label = await page.$(`label[for="${id}"]`);
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');

        expect(label || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }
  });
});
```

## Framework-Specific Integrations

### React Hook

```javascript
// hooks/useBiModal Design.js
import { useState, useEffect } from 'react';
import { BiModalDesignDetector } from '../lib/agentux';

export function useBiModal Design(options = {}) {
  const [agentInfo, setAgentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detector = new BiModalDesignDetector(options);
    const detection = detector.detect();

    setAgentInfo(detection);
    setIsLoading(false);

    if (detection.isAgent) {
      detector.enhance();
    }
  }, []);

  return {
    agentInfo,
    isAgent: agentInfo?.isAgent || false,
    isLoading,
    agentCategory: agentInfo?.category,
    agentCapabilities: agentInfo?.capabilities,
  };
}

// Component usage
function MyComponent() {
  const { isAgent, agentCategory, isLoading } = useBiModal Design();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div data-agent-detected={isAgent}>
      {isAgent && (
        <div className="agent-notice">Optimized for {agentCategory} agents</div>
      )}
      <main role="main">{/* Your content */}</main>
    </div>
  );
}
```

### Vue Composable

```javascript
// composables/useBiModal Design.js
import { ref, onMounted, readonly } from 'vue';
import { BiModalDesignDetector } from '../lib/agentux';

export function useBiModal Design(options = {}) {
  const agentInfo = ref(null);
  const isLoading = ref(true);

  const detect = () => {
    const detector = new BiModalDesignDetector(options);
    const detection = detector.detect();

    agentInfo.value = detection;
    isLoading.value = false;

    if (detection.isAgent) {
      detector.enhance();
    }
  };

  onMounted(() => {
    detect();
  });

  return {
    agentInfo: readonly(agentInfo),
    isAgent: computed(() => agentInfo.value?.isAgent || false),
    isLoading: readonly(isLoading),
    agentCategory: computed(() => agentInfo.value?.category),
    agentCapabilities: computed(() => agentInfo.value?.capabilities),
  };
}
```

### Angular Service

```typescript
// services/agent-ux.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BiModalDesignDetector } from '../lib/agentux';

export interface AgentInfo {
  isAgent: boolean;
  category?: string;
  name?: string;
  capabilities?: any;
}

@Injectable({
  providedIn: 'root',
})
export class BiModal DesignService {
  private agentInfoSubject = new BehaviorSubject<AgentInfo | null>(null);
  private detector: BiModalDesignDetector;

  constructor() {
    this.detector = new BiModalDesignDetector();
    this.initializeDetection();
  }

  get agentInfo$(): Observable<AgentInfo | null> {
    return this.agentInfoSubject.asObservable();
  }

  get isAgent(): boolean {
    return this.agentInfoSubject.value?.isAgent || false;
  }

  private initializeDetection(): void {
    const detection = this.detector.detect();
    this.agentInfoSubject.next(detection);

    if (detection.isAgent) {
      this.detector.enhance();
    }
  }

  getAgentPreferences() {
    return this.detector.getPreferences();
  }
}

// Component usage
import { Component, OnInit } from '@angular/core';
import { BiModal DesignService } from './services/agent-ux.service';

@Component({
  selector: 'app-root',
  template: `
    <div [attr.data-agent-detected]="agentService.isAgent">
      <div *ngIf="agentService.isAgent" class="agent-notice">
        Agent-optimized interface active
      </div>
      <main role="main">
        <!-- Your content -->
      </main>
    </div>
  `,
})
export class AppComponent implements OnInit {
  constructor(public agentService: BiModal DesignService) {}

  ngOnInit() {
    this.agentService.agentInfo$.subscribe((agentInfo) => {
      console.log('Agent info updated:', agentInfo);
    });
  }
}
```

## Commit Description

````
Add comprehensive BiModal Design API reference documentation

- Complete HTML attributes specification with 50+ data-agent-* attributes
- Structured data schemas for products, articles, organizations, and websites
- HTTP headers and meta tags reference for agent optimization
- Full JavaScript detection API with capability assessment and enhancement
- CSS classes and selectors for agent-specific styling
- Server-side implementation examples for Node.js, Express, and Next.js
- Testing and validation APIs with Playwright integration
- Framework-specific integrations for React, Vue, and Angular
- Agent categorization patterns for search, social, shopping, automation, and CLI
- Performance optimization techniques and responsive design considerations

Provides complete technical specification for developers implementing BiModal Design
Covers all aspects from basic HTML markup to advanced JavaScript detection
Includes production-ready code examples and testing strategies
```# BiModal Design API Reference

Technical specifications and reference documentation for implementing BiModal Design patterns in web applications.

## Table of Contents

1. [HTML Attributes Reference](#html-attributes-reference)
2. [Structured Data Schemas](#structured-data-schemas)
3. [HTTP Headers and Meta Tags](#http-headers-and-meta-tags)
4. [JavaScript Detection API](#javascript-detection-api)
5. [CSS Classes and Selectors](#css-classes-and-selectors)
6. [Server-Side Implementation](#server-side-implementation)
7. [Testing and Validation APIs](#testing-and-validation-apis)
8. [Framework-Specific Integrations](#framework-specific-integrations)

## HTML Attributes Reference

### Core Agent Attributes

All BiModal Design attributes use the `data-agent-*` namespace to ensure compatibility and avoid conflicts.

#### Page-Level Attributes

```html
<!-- Document root attributes -->
<html
  data-agent-framework="react|vue|angular|astro|next|nuxt"
  data-agent-version="major.minor.patch"
  data-agent-context="detected|unknown"
  data-agent-mode="ssr|ssg|csr|hybrid"
>
````

**Attribute Specifications:**

| Attribute              | Required | Values                                                       | Description                           |
| ---------------------- | -------- | ------------------------------------------------------------ | ------------------------------------- |
| `data-agent-framework` | No       | `react`, `vue`, `angular`, `astro`, `next`, `nuxt`, `custom` | Framework used for implementation     |
| `data-agent-version`   | No       | Semantic version string                                      | BiModal Design implementation version |
| `data-agent-context`   | No       | `detected`, `unknown`                                        | Whether agent was detected            |
| `data-agent-mode`      | No       | `ssr`, `ssg`, `csr`, `hybrid`                                | Rendering strategy used               |

#### Page Content Attributes

```html
<!-- Page identification -->
<body
  data-agent-page="home|products|contact|article|dashboard"
  data-agent-intent="browse|search|purchase|support|read"
  data-agent-content-type="product-catalog|article|form|dashboard"
></body>
```

**Page Type Values:**

- `home` - Landing/homepage
- `products` - Product catalog or listing
- `contact` - Contact or support page
- `article` - Content article or blog post
- `dashboard` - User dashboard or admin panel
- `checkout` - Purchase or payment flow
- `search` - Search results page
- `profile` - User profile or account page

**Intent Values:**

- `browse` - Casual browsing behavior
- `search` - Specific search intent
- `purchase` - Commercial transaction intent
- `support` - Help or support seeking
- `read` - Content consumption
- `manage` - Account or data management

### Component Attributes

#### Navigation Components

```html
<!-- Primary navigation -->
<nav
  data-agent-component="navigation"
  data-agent-nav-type="primary|secondary|breadcrumb|footer"
  role="navigation"
  aria-label="Main navigation"
>
  <a
    href="/products"
    data-agent-action="view-products"
    data-agent-nav-target="products"
  >
    Products
  </a>
</nav>
```

**Navigation Component Specification:**

| Attribute               | Required | Values                                         | Description                 |
| ----------------------- | -------- | ---------------------------------------------- | --------------------------- |
| `data-agent-component`  | Yes      | `navigation`                                   | Component type identifier   |
| `data-agent-nav-type`   | No       | `primary`, `secondary`, `breadcrumb`, `footer` | Navigation hierarchy level  |
| `data-agent-action`     | Yes      | Action identifier                              | Semantic action description |
| `data-agent-nav-target` | No       | Target page identifier                         | Destination page type       |

#### Content Components

```html
<!-- Product catalog -->
<section
  data-agent-component="product-list"
  data-agent-list-type="featured|category|search-results"
  data-agent-count="12"
  role="region"
  aria-labelledby="products-heading"
>
  <h2 id="products-heading" data-agent-content="section-title">
    Featured Products
  </h2>

  <div role="list">
    <article
      data-agent-component="product-card"
      data-agent-product-id="prod-123"
      data-agent-category="electronics"
      role="listitem"
      itemscope
      itemtype="https://schema.org/Product"
    >
      <h3 data-agent-content="product-name" itemprop="name">
        Wireless Headphones
      </h3>

      <p data-agent-content="product-description" itemprop="description">
        Premium wireless headphones with noise cancellation
      </p>

      <span
        data-agent-content="product-price"
        itemprop="offers"
        itemscope
        itemtype="https://schema.org/Offer"
      >
        <span itemprop="price" content="199.99">$199.99</span>
        <meta itemprop="priceCurrency" content="USD" />
      </span>

      <button
        data-agent-action="view-product-details"
        data-agent-product-id="prod-123"
        type="button"
      >
        View Details
      </button>
    </article>
  </div>
</section>
```

#### Form Components

```html
<!-- Contact form -->
<form
  data-agent-component="contact-form"
  data-agent-form-type="contact|newsletter|checkout|login"
  data-agent-form-steps="1"
  method="POST"
  action="/contact"
>
  <fieldset data-agent-section="contact-info">
    <legend data-agent-content="fieldset-label">Contact Information</legend>

    <div class="form-group">
      <label for="name" data-agent-content="field-label"> Full Name * </label>
      <input
        type="text"
        id="name"
        name="name"
        required
        data-agent-field="customer-name"
        data-agent-validation="required|text"
        aria-describedby="name-help"
      />
      <small id="name-help" data-agent-content="field-help">
        Your full name for our records
      </small>
    </div>

    <div class="form-group">
      <label for="email" data-agent-content="field-label">
        Email Address *
      </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        data-agent-field="customer-email"
        data-agent-validation="required|email"
        aria-describedby="email-help"
      />
      <small id="email-help" data-agent-content="field-help">
        We'll use this to respond to your inquiry
      </small>
    </div>
  </fieldset>

  <button
    type="submit"
    data-agent-action="submit-contact-form"
    data-agent-submit-target="/contact"
  >
    Send Message
  </button>
</form>
```

### Action Attributes

#### Standard Actions

| Action                 | Context    | Description               | Example                                                                    |
| ---------------------- | ---------- | ------------------------- | -------------------------------------------------------------------------- |
| `go-home`              | Navigation | Navigate to homepage      | `<a data-agent-action="go-home" href="/">`                                 |
| `view-products`        | Navigation | View product catalog      | `<a data-agent-action="view-products" href="/products">`                   |
| `view-product-details` | Product    | View specific product     | `<a data-agent-action="view-product-details" data-agent-product-id="123">` |
| `add-to-cart`          | Commerce   | Add item to shopping cart | `<button data-agent-action="add-to-cart" data-agent-product-id="123">`     |
| `submit-form`          | Form       | Submit form data          | `<button data-agent-action="submit-form" type="submit">`                   |
| `search-products`      | Search     | Perform product search    | `<button data-agent-action="search-products" type="submit">`               |
| `get-support`          | Support    | Access help or support    | `<a data-agent-action="get-support" href="/contact">`                      |
| `download-file`        | Content    | Download file or document | `<a data-agent-action="download-file" href="/brochure.pdf">`               |

#### E-commerce Actions

```html
<!-- Shopping cart actions -->
<button data-agent-action="add-to-cart" data-agent-product-id="prod-123">
  Add to Cart
</button>

<button data-agent-action="remove-from-cart" data-agent-product-id="prod-123">
  Remove from Cart
</button>

<button data-agent-action="update-quantity" data-agent-product-id="prod-123">
  Update Quantity
</button>

<!-- Checkout actions -->
<button data-agent-action="proceed-to-checkout" data-agent-cart-total="299.97">
  Checkout ($299.97)
</button>

<button data-agent-action="apply-coupon" data-agent-coupon-field="coupon-input">
  Apply Coupon
</button>

<!-- Product comparison -->
<button
  data-agent-action="compare-products"
  data-agent-product-ids="123,456,789"
>
  Compare Selected
</button>
```

#### Content Actions

```html
<!-- Article interactions -->
<button data-agent-action="share-article" data-agent-article-id="article-456">
  Share Article
</button>

<button
  data-agent-action="bookmark-article"
  data-agent-article-id="article-456"
>
  Bookmark
</button>

<button data-agent-action="print-article" data-agent-article-id="article-456">
  Print Article
</button>

<!-- Content filtering -->
<select data-agent-action="filter-content" data-agent-filter-type="category">
  <option value="all">All Categories</option>
  <option value="tech">Technology</option>
  <option value="business">Business</option>
</select>

<!-- Pagination -->
<a data-agent-action="next-page" data-agent-page="2" href="/articles?page=2">
  Next Page
</a>
```

### Content Attributes

#### Content Labeling

```html
<!-- Page structure -->
<h1 data-agent-content="page-title">Product Catalog</h1>
<p data-agent-content="page-description">Browse our complete product range</p>

<!-- Section structure -->
<h2 data-agent-content="section-title">Featured Products</h2>
<p data-agent-content="section-description">Our most popular items</p>

<!-- Data labeling -->
<span data-agent-content="product-name">Wireless Headphones</span>
<span data-agent-content="product-price">$199.99</span>
<span data-agent-content="product-rating">4.5/5 stars</span>

<!-- Status indicators -->
<span data-agent-content="availability-status">In Stock</span>
<span data-agent-content="shipping-info">Free shipping available</span>

<!-- Help text -->
<small data-agent-content="field-help">Your email will not be shared</small>
<div data-agent-content="error-message">Please enter a valid email address</div>
```

#### Content Types

| Content Type          | Usage                | Example                                        |
| --------------------- | -------------------- | ---------------------------------------------- |
| `page-title`          | Main page heading    | `<h1 data-agent-content="page-title">`         |
| `page-description`    | Page summary         | `<p data-agent-content="page-description">`    |
| `section-title`       | Section heading      | `<h2 data-agent-content="section-title">`      |
| `section-description` | Section summary      | `<p data-agent-content="section-description">` |
| `product-name`        | Product title        | `<span data-agent-content="product-name">`     |
| `product-price`       | Price information    | `<span data-agent-content="product-price">`    |
| `product-rating`      | Rating/review data   | `<span data-agent-content="product-rating">`   |
| `field-label`         | Form field label     | `<label data-agent-content="field-label">`     |
| `field-help`          | Help text            | `<small data-agent-content="field-help">`      |
| `error-message`       | Error information    | `<div data-agent-content="error-message">`     |
| `success-message`     | Success notification | `<div data-agent-content="success-message">`   |

### Field Attributes

#### Form Field Types

```html
<!-- Customer information -->
<input data-agent-field="customer-name" type="text" name="name" />
<input data-agent-field="customer-email" type="email" name="email" />
<input data-agent-field="customer-phone" type="tel" name="phone" />

<!-- Address information -->
<input data-agent-field="billing-address-street" type="text" name="street" />
<input data-agent-field="billing-address-city" type="text" name="city" />
<select data-agent-field="billing-address-state" name="state">
  <input data-agent-field="billing-address-zip" type="text" name="zip" />

  <!-- Product selection -->
  <select data-agent-field="product-category" name="category">
    <input data-agent-field="product-quantity" type="number" name="quantity" />
    <input data-agent-field="product-search-query" type="search" name="q" />

    <!-- Payment information -->
    <input
      data-agent-field="payment-card-number"
      type="text"
      name="card_number"
    />
    <select data-agent-field="payment-card-expiry-month" name="exp_month">
      <select data-agent-field="payment-card-expiry-year" name="exp_year">
        <input data-agent-field="payment-card-cvv" type="text" name="cvv" />

        <!-- Communication preferences -->
        <input
          data-agent-field="newsletter-subscription"
          type="checkbox"
          name="newsletter"
        />
        <textarea data-agent-field="customer-message" name="message"></textarea>
        <select data-agent-field="inquiry-type" name="subject"></select>
      </select>
    </select>
  </select>
</select>
```

#### Field Validation

```html
<input
  data-agent-field="customer-email"
  data-agent-validation="required|email|max:255"
  data-agent-error-target="email-error"
  type="email"
  name="email"
  required
  aria-describedby="email-error"
/>
<div id="email-error" data-agent-content="error-message" role="alert"></div>
```

**Validation Types:**

- `required` - Field is mandatory
- `email` - Must be valid email format
- `phone` - Must be valid phone number
- `url` - Must be valid URL
- `min:n` - Minimum length/value
- `max:n` - Maximum length/value
- `pattern:regex` - Custom regex pattern
- `numeric` - Must be numeric
- `alpha` - Must be alphabetic
- `alphanumeric` - Must be alphanumeric

## Structured Data Schemas

### Product Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "image": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  "sku": "PROD-123",
  "mpn": "MPN-456",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "category": "Electronics > Audio > Headphones",
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/123",
    "priceCurrency": "USD",
    "price": "199.99",
    "priceValidUntil": "2024-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {
      "@type": "Organization",
      "name": "Your Store Name"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0.00",
        "currency": "USD"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "businessDays": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        },
        "cutoffTime": "16:00",
        "handlingTime": {
          "@type": "QuantitativeValue",
          "minValue": 1,
          "maxValue": 2,
          "unitCode": "DAY"
        }
      }
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "John Doe"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Excellent product quality and fast shipping."
    }
  ]
}
```

### Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Headline",
  "description": "Article description or excerpt",
  "image": "https://example.com/article-image.jpg",
  "datePublished": "2024-01-15T09:00:00Z",
  "dateModified": "2024-01-16T10:30:00Z",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/authors/author-name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Publisher Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png",
      "width": 200,
      "height": 60
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/articles/article-slug"
  },
  "articleSection": "Technology",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "wordCount": 1250,
  "timeRequired": "PT5M"
}
```

### Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "description": "Company description",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Spanish"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Business Street",
    "addressLocality": "Business City",
    "addressRegion": "State",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://facebook.com/company",
    "https://twitter.com/company",
    "https://linkedin.com/company/company"
  ]
}
```

### WebSite Schema

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Website Name",
  "description": "Website description",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Company Name"
  }
}
```

### FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is your return policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a 30-day return policy for all unused items in original packaging."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer international shipping?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we ship to over 50 countries worldwide. Shipping costs vary by destination."
      }
    }
  ]
}
```

## HTTP Headers and Meta Tags

### Agent Detection Headers

#### Request Headers (Incoming)

```http
User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
From: googlebot(at)googlebot.com
```

#### Response Headers (Outgoing)

```http
X-Agent-Optimized: true
X-Agent-Framework: agentux/2.1.0
X-Agent-Rendering: ssr
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Cache-Control: public, max-age=3600
Vary: User-Agent
```

### Meta Tags

#### Essential Meta Tags

```html
<head>
  <!-- Basic meta tags -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta
    name="description"
    content="Page description for search engines and agents"
  />
  <meta name="keywords" content="keyword1, keyword2, keyword3" />
  <meta name="robots" content="index, follow" />

  <!-- Agent-specific meta tags -->
  <meta name="agent-page" content="product-catalog" />
  <meta name="agent-intent" content="browse-products" />
  <meta name="agent-framework" content="next.js" />
  <meta name="agent-version" content="2.1.0" />

  <!-- Open Graph for social media agents -->
  <meta property="og:title" content="Page Title" />
  <meta property="og:description" content="Page description" />
  <meta property="og:image" content="https://example.com/image.jpg" />
  <meta property="og:url" content="https://example.com/current-page" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Site Name" />

  <!-- Twitter Card for Twitter agents -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Page Title" />
  <meta name="twitter:description" content="Page description" />
  <meta name="twitter:image" content="https://example.com/image.jpg" />
  <meta name="twitter:site" content="@yourusername" />

  <!-- Canonical URL for search engines -->
  <link rel="canonical" href="https://example.com/current-page" />

  <!-- Preload critical resources for agents -->
  <link rel="preload" href="/critical.css" as="style" />
  <link rel="preload" href="/api/products" as="fetch" crossorigin="anonymous" />
</head>
```

#### E-commerce Meta Tags

```html
<!-- Product-specific meta tags -->
<meta name="product:price:amount" content="199.99" />
<meta name="product:price:currency" content="USD" />
<meta name="product:availability" content="in stock" />
<meta name="product:condition" content="new" />
<meta name="product:brand" content="Brand Name" />
<meta name="product:category" content="Electronics" />

<!-- Shopping-specific Open Graph -->
<meta property="product:price:amount" content="199.99" />
<meta property="product:price:currency" content="USD" />
<meta property="og:availability" content="instock" />
<meta property="og:condition" content="new" />
```

#### Article Meta Tags

```html
<!-- Article-specific meta tags -->
<meta name="article:author" content="Author Name" />
<meta name="article:published_time" content="2024-01-15T09:00:00Z" />
<meta name="article:modified_time" content="2024-01-16T10:30:00Z" />
<meta name="article:section" content="Technology" />
<meta name="article:tag" content="web development" />
<meta name="article:tag" content="accessibility" />

<!-- Open Graph for articles -->
<meta property="og:type" content="article" />
<meta
  property="article:author"
  content="https://example.com/authors/author-name"
/>
<meta property="article:published_time" content="2024-01-15T09:00:00Z" />
<meta property="article:modified_time" content="2024-01-16T10:30:00Z" />
<meta property="article:section" content="Technology" />
<meta property="article:tag" content="web development" />
```

## JavaScript Detection API

### Agent Detection Function

```javascript
/**
 * BiModal Design Detection Library
 * Detects and categorizes user agents for optimal experience delivery
 */

class BiModalDesignDetector {
  constructor(config = {}) {
    this.config = {
      enableAnalytics: config.enableAnalytics ?? true,
      customPatterns: config.customPatterns ?? {},
      strictMode: config.strictMode ?? false,
      ...config,
    };

    this.agentInfo = null;
    this.capabilities = null;
  }

  /**
   * Detect agent type and capabilities
   * @param {string} userAgent - User agent string (optional, uses navigator.userAgent if not provided)
   * @returns {AgentInfo} Agent detection results
   */
  detect(userAgent = navigator.userAgent) {
    const detection = this.analyzeUserAgent(userAgent);
    const capabilities = this.detectCapabilities();

    this.agentInfo = {
      ...detection,
      capabilities,
      timestamp: new Date().toISOString(),
      sessionId: this.generateSessionId(),
    };

    if (this.config.enableAnalytics) {
      this.trackDetection(this.agentInfo);
    }

    return this.agentInfo;
  }

  /**
   * Analyze user agent string for patterns
   * @private
   */
  analyzeUserAgent(userAgent) {
    const patterns = {
      // Search engine bots
      search: [
        { pattern: /googlebot/i, name: 'GoogleBot', vendor: 'Google' },
        { pattern: /bingbot/i, name: 'BingBot', vendor: 'Microsoft' },
        { pattern: /slurp/i, name: 'Yahoo Slurp', vendor: 'Yahoo' },
        { pattern: /duckduckbot/i, name: 'DuckDuckBot', vendor: 'DuckDuckGo' },
        { pattern: /baiduspider/i, name: 'Baidu Spider', vendor: 'Baidu' },
        { pattern: /yandexbot/i, name: 'YandexBot', vendor: 'Yandex' },
      ],

      // Social media bots
      social: [
        {
          pattern: /facebookexternalhit/i,
          name: 'Facebook Bot',
          vendor: 'Meta',
        },
        { pattern: /twitterbot/i, name: 'TwitterBot', vendor: 'Twitter' },
        { pattern: /linkedinbot/i, name: 'LinkedInBot', vendor: 'LinkedIn' },
        { pattern: /whatsapp/i, name: 'WhatsApp Bot', vendor: 'Meta' },
        { pattern: /telegrambot/i, name: 'Telegram Bot', vendor: 'Telegram' },
      ],

      // Shopping and comparison bots
      shopping: [
        { pattern: /shopping/i, name: 'Shopping Bot', vendor: 'Generic' },
        { pattern: /price/i, name: 'Price Comparison', vendor: 'Generic' },
        { pattern: /comparison/i, name: 'Comparison Bot', vendor: 'Generic' },
        { pattern: /pronto/i, name: 'Pronto', vendor: 'Pronto' },
      ],

      // Automation and testing tools
      automation: [
        { pattern: /headless/i, name: 'Headless Browser', vendor: 'Generic' },
        { pattern: /selenium/i, name: 'Selenium', vendor: 'Selenium' },
        { pattern: /playwright/i, name: 'Playwright', vendor: 'Microsoft' },
        { pattern: /puppeteer/i, name: 'Puppeteer', vendor: 'Google' },
        { pattern: /cypress/i, name: 'Cypress', vendor: 'Cypress' },
      ],

      // Command line tools
      cli: [
        { pattern: /curl/i, name: 'cURL', vendor: 'cURL' },
        { pattern: /wget/i, name: 'Wget', vendor: 'GNU' },
        { pattern: /httpie/i, name: 'HTTPie', vendor: 'HTTPie' },
        { pattern: /postman/i, name: 'Postman', vendor: 'Postman' },
      ],

      // Generic bots
      generic: [
        { pattern: /bot/i, name: 'Generic Bot', vendor: 'Unknown' },
        { pattern: /crawler/i, name: 'Generic Crawler', vendor: 'Unknown' },
        { pattern: /spider/i, name: 'Generic Spider', vendor: 'Unknown' },
      ],

      // Custom patterns from config
      ...this.config.customPatterns,
    };

    // Find matching pattern
    for (const [category, categoryPatterns] of Object.entries(patterns)) {
      for (const { pattern, name, vendor } of categoryPatterns) {
        if (pattern.test(userAgent)) {
          return {
            isAgent: true,
            category,
            name,
            vendor,
            userAgent,
            confidence: this.calculateConfidence(userAgent, pattern),
          };
        }
      }
    }

    // No agent pattern matched
    return {
      isAgent: false,
      category: 'human',
      name: 'Human User',
      vendor: 'Browser',
      userAgent,
      confidence: 0.95,
    };
  }

  /**
   * Detect browser/agent capabilities
   * @private
   */
  detectCapabilities() {
    if (typeof window === 'undefined') {
      return { environment: 'server' };
    }

    return {
      environment: 'browser',
      javascript: true,
      cookies: navigator.cookieEnabled || false,
      localStorage: this.testLocalStorage(),
      sessionStorage: this.testSessionStorage(),
      indexedDB: 'indexedDB' in window,
      webGL: this.testWebGL(),
      canvas: this.testCanvas(),
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      webRTC: this.testWebRTC(),
      mediaDevices: 'mediaDevices' in navigator,
      touchSupport: 'ontouchstart' in window,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1,
      },
      connection: this.getConnectionInfo(),
      memory: navigator.deviceMemory || null,
      cores: navigator.hardwareConcurrency || null,
    };
  }

  /**
   * Test localStorage availability
   * @private
   */
  testLocalStorage() {
    try {
      const test = 'agentux_test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Test sessionStorage availability
   * @private
   */
  testSessionStorage() {
    try {
      const test = 'agentux_test';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Test WebGL support
   * @private
   */
  testWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * Test Canvas support
   * @private
   */
  testCanvas() {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    } catch (e) {
      return false;
    }
  }

  /**
   * Test WebRTC support
   * @private
   */
  testWebRTC() {
    return !!(
      window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection
    );
  }

  /**
   * Get connection information
   * @private
   */
  getConnectionInfo() {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    return connection
      ? {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        }
      : null;
  }

  /**
   * Calculate confidence score for agent detection
   * @private
   */
  calculateConfidence(userAgent, pattern) {
    const length = userAgent.length;
    const matches = userAgent.match(pattern);

    // Base confidence on pattern specificity and user agent completeness
    let confidence = 0.8;

    if (matches && matches[0].length > 10) confidence += 0.1;
    if (length > 50) confidence += 0.05;
    if (length < 20) confidence -= 0.2;

    return Math.min(0.99, Math.max(0.1, confidence));
  }

  /**
   * Generate unique session ID
   * @private
   */
  generateSessionId() {
    return (
      'agentux_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    );
  }

  /**
   * Track agent detection for analytics
   * @private
   */
  trackDetection(agentInfo) {
    if (typeof window !== 'undefined' && window.fetch) {
      fetch('/api/agentux/detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentInfo),
      }).catch(() => {}); // Silent fail for analytics
    }
  }

  /**
   * Get agent preferences based on detection
   * @returns {AgentPreferences} Recommended preferences for detected agent
   */
  getPreferences() {
    if (!this.agentInfo) {
      throw new Error('Must call detect() first');
    }

    const preferences = {
      preferStatic: false,
      preferTraditionalNav: false,
      preferSimpleUI: false,
      preferStructuredData: true,
      enhanceSemantics: true,
      disableAnimations: false,
      prioritizePerformance: false,
    };

    switch (this.agentInfo.category) {
      case 'search':
        preferences.preferStatic = true;
        preferences.preferTraditionalNav = true;
        preferences.preferSimpleUI = true;
        preferences.disableAnimations = true;
        preferences.prioritizePerformance = true;
        break;

      case 'social':
        preferences.preferStatic = true;
        preferences.preferTraditionalNav = true;
        preferences.enhanceSemantics = true;
        break;

      case 'shopping':
        preferences.preferStructuredData = true;
        preferences.enhanceSemantics = true;
        preferences.prioritizePerformance = true;
        break;

      case 'cli':
        preferences.preferStatic = true;
        preferences.preferTraditionalNav = true;
        preferences.preferSimpleUI = true;
        preferences.disableAnimations = true;
        break;

      case 'automation':
        preferences.preferTraditionalNav = false; // Can handle SPAs
        preferences.enhanceSemantics = true;
        break;

      default:
        // Keep defaults for unknown agents
        break;
    }

    // Override based on capabilities
    if (!this.agentInfo.capabilities.javascript) {
      preferences.preferStatic = true;
      preferences.preferTraditionalNav = true;
      preferences.preferSimpleUI = true;
    }

    return preferences;
  }

  /**
   * Apply agent-specific enhancements to the page
   * @param {AgentPreferences} customPreferences - Override default preferences
   */
  enhance(customPreferences = {}) {
    if (!this.agentInfo?.isAgent) return;

    const preferences = { ...this.getPreferences(), ...customPreferences };

    // Apply document-level attributes
    document.documentElement.setAttribute('data-agent-context', 'detected');
    document.documentElement.setAttribute(
      'data-agent-type',
      this.agentInfo.name
    );
    document.documentElement.setAttribute(
      'data-agent-category',
      this.agentInfo.category
    );

    // Apply performance optimizations
    if (preferences.disableAnimations) {
      this.disableAnimations();
    }

    if (preferences.enhanceSemantics) {
      this.enhanceSemantics();
    }

    if (preferences.preferSimpleUI) {
      this.simplifyUI();
    }

    // Add navigation aids
    this.addNavigationAids(preferences);
  }

  /**
   * Disable animations for performance
   * @private
   */
  disableAnimations() {
    const style = document.createElement('style');
    style.id = 'agentux-animations';
    style.textContent = `
      [data-agent-context="detected"] *,
      [data-agent-context="detected"] *::before,
      [data-agent-context="detected"] *::after {
        animation-duration: 0.01ms !important;
        animation-delay: -0.01ms !important;
        transition-duration: 0.01ms !important;
        transition-delay: -0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Enhance semantic markup
   * @private
   */
  enhanceSemantics() {
    // Add missing ARIA labels
    const buttons = document.querySelectorAll(
      'button:not([aria-label]):not([aria-labelledby])'
    );
    buttons.forEach((button) => {
      const text = button.textContent.trim();
      if (text) {
        button.setAttribute('aria-label', text);
      }
    });

    // Enhance form fields
    const inputs = document.querySelectorAll(
      'input:not([aria-label]):not([aria-labelledby])'
    );
    inputs.forEach((input) => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label && !input.hasAttribute('aria-label')) {
        input.setAttribute(
          'aria-labelledby',
          label.id || this.generateId('label')
        );
      }
    });

    // Add agent-specific attributes to interactive elements
    this.addAgentAttributes();
  }

  /**
   * Add agent-specific attributes to elements
   * @private
   */
  addAgentAttributes() {
    // Add action attributes to buttons
    const buttons = document.querySelectorAll(
      'button:not([data-agent-action])'
    );
    buttons.forEach((button) => {
      const text = button.textContent.toLowerCase();
      let action = 'button-click';

      if (text.includes('submit') || text.includes('send'))
        action = 'submit-form';
      else if (text.includes('search')) action = 'perform-search';
      else if (text.includes('buy') || text.includes('purchase'))
        action = 'initiate-purchase';
      else if (text.includes('add') && text.includes('cart'))
        action = 'add-to-cart';
      else if (text.includes('contact') || text.includes('support'))
        action = 'get-support';

      button.setAttribute('data-agent-action', action);
    });

    // Add navigation attributes to links
    const links = document.querySelectorAll('a:not([data-agent-action])');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      const text = link.textContent.toLowerCase();
      let action = 'navigate';

      if (href === '/' || text.includes('home')) action = 'go-home';
      else if (href?.includes('product') || text.includes('product'))
        action = 'view-products';
      else if (href?.includes('contact') || text.includes('contact'))
        action = 'get-support';
      else if (href?.includes('about') || text.includes('about'))
        action = 'view-about';

      link.setAttribute('data-agent-action', action);
    });
  }

  /**
   * Simplify UI for better agent parsing
   * @private
   */
  simplifyUI() {
    const style = document.createElement('style');
    style.id = 'agentux-simplify';
    style.textContent = `
      [data-agent-context="detected"] {
        font-size: 16px !important;
        line-height: 1.6 !important;
      }
      [data-agent-context="detected"] * {
        box-shadow: none !important;
        text-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Add navigation aids for agents
   * @private
   */
  addNavigationAids(preferences) {
    // Add skip links if not present
    if (!document.querySelector('.agentux-skip-link')) {
      this.addSkipLinks();
    }

    // Add breadcrumbs if appropriate
    if (
      preferences.preferTraditionalNav &&
      !document.querySelector('[data-agentux-breadcrumbs]')
    ) {
      this.addBreadcrumbs();
    }
  }

  /**
   * Add skip links for accessibility
   * @private
   */
  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'agentux-skip-link';
    skipLink.setAttribute('data-agent-action', 'skip-to-content');

    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      font-size: 14px;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * Add breadcrumb navigation
   * @private
   */
  addBreadcrumbs() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);

    if (segments.length === 0) return;

    const nav =
      document.querySelector('nav') || document.querySelector('header');
    if (!nav) return;

    const breadcrumbs = document.createElement('nav');
    breadcrumbs.setAttribute('aria-label', 'Breadcrumb');
    breadcrumbs.setAttribute('data-agentux-breadcrumbs', 'true');
    breadcrumbs.className = 'agentux-breadcrumbs';

    let breadcrumbHTML =
      '<ol style="display: flex; gap: 0.5rem; margin: 0; padding: 0.5rem; list-style: none; font-size: 0.875rem;">';
    breadcrumbHTML +=
      '<li><a href="/" data-agent-action="go-home">Home</a></li>';

    segments.forEach((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      const isLast = index === segments.length - 1;
      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

      breadcrumbHTML += '<li><span aria-hidden="true"> › </span>';

      if (isLast) {
        breadcrumbHTML += `<span aria-current="page" data-agent-content="current-page">${label}</span>`;
      } else {
        breadcrumbHTML += `<a href="${path}" data-agent-action="navigate-to-${segment}">${label}</a>`;
      }

      breadcrumbHTML += '</li>';
    });

    breadcrumbHTML += '</ol>';
    breadcrumbs.innerHTML = breadcrumbHTML;

    nav.appendChild(breadcrumbs);
  }

  /**
   * Generate unique ID for elements
   * @private
   */
  generateId(prefix = 'agentux') {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Usage Examples
const agentDetector = new BiModalDesignDetector({
  enableAnalytics: true,
  customPatterns: {
    'custom-bots': [
      { pattern: /mycompanybot/i, name: 'Company Bot', vendor: 'My Company' },
    ],
  },
});

// Detect agent
const agentInfo = agentDetector.detect();

// Apply enhancements if agent detected
if (agentInfo.isAgent) {
  agentDetector.enhance();
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BiModalDesignDetector;
}

// Global access for direct script inclusion
if (typeof window !== 'undefined') {
  window.BiModalDesignDetector = BiModalDesignDetector;
}
```

## Summary

This API reference provides comprehensive technical documentation for
implementing BiModal Design, including:

- **Complete HTML attribute specifications** for all agent-specific markup
- **JavaScript detection API** with full capability assessment
- **Structured data schemas** for various content types
- **Server-side implementation examples** for multiple frameworks
- **Testing and validation tools** for ensuring compatibility
- **Framework integrations** for React, Vue, and Angular

The documentation is production-ready and provides everything developers need to
implement BiModal Design patterns in their applications.

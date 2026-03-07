# Astro SSG BiModal Design Implementation Example

> **v3.0 Migration Note:** This example uses `data-agent-*` attributes from
> BiModal Design v2.x. In v3.0, these are replaced with established standards:
> `itemscope`/`itemprop` (schema.org), `aria-label`/`aria-current` (WAI-ARIA),
> and OpenAPI (API documentation). See the
> [Next.js SSR Example](./nextjs-ssr-example.md) for a v3.0-native
> implementation, or the
> [compliance checklist](../docs/compliance-checklist.md#migration-from-v2x) for
> the migration table.

This example demonstrates how to implement BiModal Design patterns in an Astro
application using Static Site Generation (SSG) to ensure optimal agent
accessibility and blazing-fast performance for both humans and AI agents.

## Overview

Astro's static-first approach makes it ideal for BiModal Design implementation.
By generating static HTML at build time, we ensure that all content is
immediately available to agents without requiring JavaScript execution, while
still providing interactive features for human users through selective
hydration.

## Project Structure

```
astro-bimodal-app/
├── astro.config.mjs
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── products/
│   │   │   ├── index.astro
│   │   │   └── [id].astro
│   │   └── contact.astro
│   ├── components/
│   │   ├── Navigation.astro
│   │   ├── ProductCard.astro
│   │   ├── ContactForm.astro
│   │   └── AgentDetector.astro
│   ├── scripts/
│   │   └── agent-detection.js
│   └── styles/
│       └── global.css
├── public/
│   ├── robots.txt
│   └── sitemap.xml
└── package.json
```

## Configuration

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',

  // Static site generation (default)
  output: 'static',

  // Integrations for enhanced functionality
  integrations: [
    tailwind(),
    sitemap({
      // Generate sitemap for better agent discovery
      customPages: [
        'https://example.com/products',
        'https://example.com/contact',
      ],
    }),
  ],

  // Build optimizations for agents
  build: {
    // Inline small scripts for better agent compatibility
    inlineStylesheets: 'auto',
  },

  // Vite configuration for asset handling
  vite: {
    build: {
      // Optimize for both agents and humans
      cssCodeSplit: false, // Single CSS file for simpler parsing
      rollupOptions: {
        output: {
          // Predictable asset naming for agents
          assetFileNames: 'assets/[name].[ext]',
          chunkFileNames: 'chunks/[name].js',
          entryFileNames: 'scripts/[name].js',
        },
      },
    },
  },
});
```

## Base Layout

### src/layouts/Layout.astro

```astro
---
export interface Props {
  title: string
  description?: string
  agentPage?: string
  agentIntent?: string
}

const {
  title,
  description = 'BiModal Design implementation with Astro SSG',
  agentPage,
  agentIntent
} = Astro.props
---

<!DOCTYPE html>
<html lang="en" data-agent-framework="astro" data-agent-version="4.0">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow" />
    <meta name="generator" content={Astro.generator} />

    <!-- Agent-specific meta tags -->
    {agentPage && <meta name="agent-page" content={agentPage} />}
    {agentIntent && <meta name="agent-intent" content={agentIntent} />}

    <!-- Preload critical resources for faster agent parsing -->
    <link rel="preload" href="/styles/global.css" as="style" />

    <title>{title}</title>

    <!-- Structured data for enhanced agent understanding -->
    <script type="application/ld+json" set:html={JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "BiModal Design Astro Store",
      "description": description,
      "url": Astro.site?.toString(),
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${Astro.site}/products?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    })} />
  </head>

  <body data-agent-ready="true">
    <a href="#main-content" class="skip-link" data-agent-action="skip-to-content">
      Skip to main content
    </a>

    <header role="banner">
      <Navigation />
    </header>

    <main role="main" id="main-content" tabindex="-1">
      <slot />
    </main>

    <footer role="contentinfo" data-agent-component="site-footer">
      <p>&copy; 2025 BiModal Design Astro Example. Built with accessibility in mind.</p>
      <nav aria-label="Footer navigation">
        <ul role="list">
          <li><a href="/privacy" data-agent-action="view-privacy">Privacy Policy</a></li>
          <li><a href="/terms" data-agent-action="view-terms">Terms of Service</a></li>
          <li><a href="/contact" data-agent-action="get-support">Contact Support</a></li>
        </ul>
      </nav>
    </footer>

    <!-- Agent detection script (progressive enhancement) -->
    <script src="/scripts/agent-detection.js"></script>
  </body>
</html>

<style>
  /* Global agent-friendly styles */
  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #fff;
  }

  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
  }

  .skip-link:focus {
    top: 6px;
  }

  /* Enhanced focus visibility for agents */
  *:focus-visible {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }

  /* Agent-specific optimizations */
  [data-agent-context="detected"] {
    font-size: 18px;
    line-height: 1.8;
  }
</style>
```

## Navigation Component

### src/components/Navigation.astro

```astro
---
// Get current page for active state
const currentPath = Astro.url.pathname
---

<nav
  role="navigation"
  aria-label="Main navigation"
  data-agent-component="primary-navigation"
>
  <div class="nav-container">
    <a
      href="/"
      class="logo"
      data-agent-action="go-home"
      aria-label="BiModal Design Store - Go to homepage"
    >
      <span data-agent-content="site-name">BiModal Design Store</span>
    </a>

    <ul role="list" class="nav-links">
      <li>
        <a
          href="/"
          data-agent-action="browse-home"
          class={currentPath === '/' ? 'active' : ''}
          aria-current={currentPath === '/' ? 'page' : undefined}
        >
          Home
        </a>
      </li>
      <li>
        <a
          href="/products"
          data-agent-action="view-products"
          class={currentPath.startsWith('/products') ? 'active' : ''}
          aria-current={currentPath.startsWith('/products') ? 'page' : undefined}
        >
          Products
        </a>
      </li>
      <li>
        <a
          href="/contact"
          data-agent-action="get-support"
          class={currentPath === '/contact' ? 'active' : ''}
          aria-current={currentPath === '/contact' ? 'page' : undefined}
        >
          Contact
        </a>
      </li>
    </ul>

    <!-- Search form for agents -->
    <form
      role="search"
      class="search-form"
      data-agent-component="site-search"
      action="/products"
      method="GET"
    >
      <label for="search" class="sr-only">Search products</label>
      <input
        type="search"
        id="search"
        name="q"
        placeholder="Search products..."
        data-agent-field="search-query"
        aria-label="Search products"
      />
      <button
        type="submit"
        data-agent-action="search-products"
        aria-label="Search"
      >
        🔍
      </button>
    </form>
  </div>
</nav>

<style>
  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
    color: #333;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-links a {
    text-decoration: none;
    color: #666;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .nav-links a:hover,
  .nav-links a.active {
    background: #007bff;
    color: white;
  }

  .search-form {
    display: flex;
    gap: 0.5rem;
  }

  .search-form input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 200px;
  }

  .search-form button {
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
```

## Home Page

### src/pages/index.astro

```astro
---
import Layout from '../layouts/Layout.astro'
import ProductCard from '../components/ProductCard.astro'

// Static data for SSG (could be from CMS, API, etc.)
const featuredProducts = [
  {
    id: '1',
    name: 'Smart Agent-Friendly Widget',
    description: 'Designed for optimal agent interaction with clear semantic structure.',
    price: 29.99,
    rating: 4.8,
    image: '/images/widget-1.jpg',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Accessible Data Processor',
    description: 'Processes data with both human and agent-readable outputs.',
    price: 49.99,
    rating: 4.9,
    image: '/images/processor-1.jpg',
    category: 'Software'
  },
  {
    id: '3',
    name: 'Universal Interface Kit',
    description: 'Interface components that work seamlessly with AI agents.',
    price: 39.99,
    rating: 4.7,
    image: '/images/interface-kit.jpg',
    category: 'Hardware'
  }
]

// Page metadata
const pageTitle = 'BiModal Design Store - Products for Humans and AI'
const pageDescription = 'Discover our collection of products designed for optimal agent and human experience using BiModal Design patterns.'
---

<Layout
  title={pageTitle}
  description={pageDescription}
  agentPage="home"
  agentIntent="browse-products"
>
  <div data-agent-page="home" data-agent-content-type="product-showcase">
    <!-- Hero Section -->
    <section role="banner" class="hero" data-agent-component="hero-banner">
      <div class="hero-content">
        <h1 data-agent-content="page-title">
          Welcome to the Future of Agent-Human Interaction
        </h1>
        <p data-agent-content="page-description" class="hero-subtitle">
          Discover products designed with BiModal Design principles - optimized for both AI agents and human users
        </p>
        <div class="hero-actions">
          <a
            href="/products"
            class="cta-button primary"
            data-agent-action="view-all-products"
            role="button"
          >
            Browse All Products
          </a>
          <a
            href="/contact"
            class="cta-button secondary"
            data-agent-action="get-consultation"
            role="button"
          >
            Get Consultation
          </a>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section
      role="region"
      aria-labelledby="featured-heading"
      data-agent-component="featured-products"
    >
      <div class="container">
        <h2 id="featured-heading" data-agent-content="section-title">
          Featured Products
        </h2>
        <p data-agent-content="section-description">
          Our top-rated products that showcase BiModal Design design principles
        </p>

        <div
          class="products-grid"
          data-agent-component="product-list"
          data-agent-list-type="featured"
          role="list"
          aria-label="Featured products"
        >
          {featuredProducts.map(product => (
            <ProductCard
              product={product}
              featured={true}
            />
          ))}
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section
      role="region"
      aria-labelledby="benefits-heading"
      data-agent-component="benefits-section"
      class="benefits"
    >
      <div class="container">
        <h2 id="benefits-heading" data-agent-content="section-title">
          Why Choose BiModal Design Products?
        </h2>

        <div class="benefits-grid">
          <article class="benefit" data-agent-component="benefit-item">
            <h3 data-agent-content="benefit-title">🤖 Agent-Optimized</h3>
            <p data-agent-content="benefit-description">
              Every product is designed with AI agents in mind, featuring semantic markup and clear data structures.
            </p>
          </article>

          <article class="benefit" data-agent-component="benefit-item">
            <h3 data-agent-content="benefit-title">👥 Human-Friendly</h3>
            <p data-agent-content="benefit-description">
              Beautiful interfaces that delight human users while maintaining full accessibility standards.
            </p>
          </article>

          <article class="benefit" data-agent-component="benefit-item">
            <h3 data-agent-content="benefit-title">⚡ Performance First</h3>
            <p data-agent-content="benefit-description">
              Static generation ensures lightning-fast loading for both humans and automated systems.
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- Structured Data for Products -->
    <script type="application/ld+json" set:html={JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": featuredProducts.map((product, index) => ({
        "@type": "Product",
        "position": index + 1,
        "name": product.name,
        "description": product.description,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "ratingCount": 100
        }
      }))
    })} />
  </div>
</Layout>

<style>
  .hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6rem 2rem;
    text-align: center;
  }

  .hero-content h1 {
    font-size: clamp(2rem, 5vw, 4rem);
    margin-bottom: 1.5rem;
    font-weight: 700;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2.5rem;
    opacity: 0.95;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cta-button {
    display: inline-block;
    padding: 1rem 2rem;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }

  .cta-button.primary {
    background: white;
    color: #667eea;
  }

  .cta-button.secondary {
    background: transparent;
    color: white;
    border-color: white;
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  .container h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
  }

  .container p {
    text-align: center;
    font-size: 1.125rem;
    color: #666;
    margin-bottom: 3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .benefits {
    background: #f8f9fa;
  }

  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .benefit {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .benefit h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
  }

  .benefit p {
    color: #666;
    line-height: 1.6;
  }
</style>
```

## Product Card Component

### src/components/ProductCard.astro

```astro
---
export interface Props {
  product: {
    id: string
    name: string
    description: string
    price: number
    rating: number
    image: string
    category: string
  }
  featured?: boolean
}

const { product, featured = false } = Astro.props
---

<article
  class={`product-card ${featured ? 'featured' : ''}`}
  data-agent-component="product-card"
  data-agent-product-id={product.id}
  data-agent-category={product.category}
  itemscope
  itemtype="https://schema.org/Product"
  role="listitem"
>
  <div class="product-image-container">
    <img
      src={product.image}
      alt={`${product.name} - ${product.description}`}
      class="product-image"
      itemprop="image"
      data-agent-content="product-image"
      loading="lazy"
      width="300"
      height="200"
    />
    {featured && (
      <span
        class="featured-badge"
        data-agent-content="product-badge"
        aria-label="Featured product"
      >
        ⭐ Featured
      </span>
    )}
  </div>

  <div class="product-info">
    <header class="product-header">
      <h3
        class="product-name"
        itemprop="name"
        data-agent-content="product-name"
      >
        {product.name}
      </h3>

      <span
        class="product-category"
        itemprop="category"
        data-agent-content="product-category"
      >
        {product.category}
      </span>
    </header>

    <p
      class="product-description"
      itemprop="description"
      data-agent-content="product-description"
    >
      {product.description}
    </p>

    <div class="product-meta">
      <div
        class="product-price"
        itemprop="offers"
        itemscope
        itemtype="https://schema.org/Offer"
        data-agent-content="product-price"
      >
        <meta itemprop="currency" content="USD" />
        <meta itemprop="availability" content="https://schema.org/InStock" />
        <span itemprop="price" content={product.price.toString()}>
          ${product.price}
        </span>
      </div>

      <div
        class="product-rating"
        itemprop="aggregateRating"
        itemscope
        itemtype="https://schema.org/AggregateRating"
        data-agent-content="product-rating"
      >
        <meta itemprop="ratingValue" content={product.rating.toString()} />
        <meta itemprop="ratingCount" content="100" />
        <span aria-label={`Rating: ${product.rating} out of 5 stars`}>
          {'⭐'.repeat(Math.floor(product.rating))} {product.rating}/5
        </span>
      </div>
    </div>

    <div class="product-actions">
      <a
        href={`/products/${product.id}`}
        class="product-link primary"
        data-agent-action="view-product-details"
        data-agent-product-id={product.id}
        aria-label={`View details for ${product.name}`}
      >
        View Details
      </a>

      <button
        type="button"
        class="product-link secondary"
        data-agent-action="quick-add-to-cart"
        data-agent-product-id={product.id}
        aria-label={`Quick add ${product.name} to cart`}
      >
        Quick Add
      </button>
    </div>
  </div>
</article>

<style>
  .product-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  }

  .product-card.featured {
    border: 2px solid #ffc107;
  }

  .product-image-container {
    position: relative;
    overflow: hidden;
  }

  .product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .product-card:hover .product-image {
    transform: scale(1.05);
  }

  .featured-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #ffc107;
    color: #333;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .product-info {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .product-header {
    margin-bottom: 1rem;
  }

  .product-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
  }

  .product-category {
    background: #e9ecef;
    color: #495057;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 500;
  }

  .product-description {
    color: #666;
    line-height: 1.5;
    margin-bottom: 1rem;
    flex: 1;
  }

  .product-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }

  .product-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #28a745;
  }

  .product-rating {
    color: #ffc107;
    font-size: 0.875rem;
  }

  .product-actions {
    display: flex;
    gap: 0.75rem;
  }

  .product-link {
    flex: 1;
    padding: 0.75rem 1rem;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    text-align: center;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .product-link.primary {
    background: #007bff;
    color: white;
  }

  .product-link.primary:hover {
    background: #0056b3;
  }

  .product-link.secondary {
    background: transparent;
    color: #007bff;
    border: 1px solid #007bff;
  }

  .product-link.secondary:hover {
    background: #007bff;
    color: white;
  }
</style>
```

## Contact Form

### src/pages/contact.astro

```astro
---
import Layout from '../layouts/Layout.astro'

const pageTitle = 'Contact Us - BiModal Design Store'
const pageDescription = 'Get in touch with our support team for questions about BiModal Design products and implementation.'
---

<Layout
  title={pageTitle}
  description={pageDescription}
  agentPage="contact"
  agentIntent="get-support"
>
  <div data-agent-page="contact" data-agent-content-type="support-form">
    <div class="container">
      <header class="page-header">
        <h1 data-agent-content="page-title">Contact Our Support Team</h1>
        <p data-agent-content="page-description">
          Have questions about BiModal Design implementation or our products? We're here to help both humans and AI agents find the right solutions.
        </p>
      </header>

      <div class="contact-layout">
        <!-- Contact Information -->
        <aside class="contact-info" data-agent-component="contact-information">
          <h2 data-agent-content="section-title">Get In Touch</h2>

          <div class="contact-methods">
            <div class="contact-method" data-agent-content="contact-email">
              <h3>📧 Email Support</h3>
              <p>
                <a
                  href="mailto:support@example.com"
                  data-agent-action="send-email"
                >
                  support@example.com
                </a>
              </p>
              <p class="response-time">Response time: 24-48 hours</p>
            </div>

            <div class="contact-method" data-agent-content="contact-hours">
              <h3>🕒 Business Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
              <p>Weekend: Emergency support only</p>
            </div>

            <div class="contact-method" data-agent-content="contact-documentation">
              <h3>📚 Documentation</h3>
              <p>
                <a
                  href="/docs"
                  data-agent-action="view-documentation"
                >
                  Browse our comprehensive guides
                </a>
              </p>
              <p>Implementation examples and best practices</p>
            </div>
          </div>
        </aside>

        <!-- Contact Form -->
        <main class="contact-form-section">
          <form
            class="contact-form"
            data-agent-component="contact-form"
            role="form"
            aria-labelledby="form-heading"
            method="POST"
            action="/api/contact"
          >
            <h2 id="form-heading" data-agent-content="form-title">Send Us a Message</h2>

            <fieldset data-agent-component="contact-details">
              <legend data-agent-content="fieldset-label">Contact Information</legend>

              <div class="form-group">
                <label for="name" data-agent-content="field-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  data-agent-field="customer-name"
                  aria-describedby="name-help"
                  autocomplete="name"
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
                  aria-describedby="email-help"
                  autocomplete="email"
                />
                <small id="email-help" data-agent-content="field-help">
                  We'll use this email to respond to your inquiry
                </small>
              </div>

              <div class="form-group">
                <label for="company" data-agent-content="field-label">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  data-agent-field="customer-company"
                  autocomplete="organization"
                />
              </div>
            </fieldset>

            <fieldset data-agent-component="inquiry-details">
              <legend data-agent-content="fieldset-label">Inquiry Details</legend>

              <div class="form-group">
                <label for="subject" data-agent-content="field-label">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  data-agent-field="inquiry-type"
                  aria-describedby="subject-help"
                >
                  <option value="">Please select a topic</option>
                  <option value="product-question">Product Questions</option>
                  <option value="implementation-help">Implementation Support</option>
                  <option value="technical-issue">Technical Issues</option>
                  <option value="billing">Billing & Accounts</option>
                  <option value="partnership">Partnership Opportunities</option>
                  <option value="other">Other</option>
                </select>
                <small id="subject-help" data-agent-content="field-help">
                  Choose the category that best describes your inquiry
                </small>
              </div>

              <div class="form-group">
                <label for="priority" data-agent-content="field-label">
                  Priority Level
                </label>
                <select
                  id="priority"
                  name="priority"
                  data-agent-field="inquiry-priority"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium" selected>Medium - Need assistance</option>
                  <option value="high">High - Urgent issue</option>
                  <option value="critical">Critical - System down</option>
                </select>
              </div>

              <div class="form-group">
                <label for="message" data-agent-content="field-label">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="6"
                  data-agent-field="customer-message"
                  aria-describedby="message-help"
                  placeholder="Please provide details about your inquiry, including any specific BiModal Design implementation questions..."
                ></textarea>
                <small id="message-help" data-agent-content="field-help">
                  Include as much detail as possible to help us provide the best assistance
                </small>
              </div>
            </fieldset>

            <fieldset data-agent-component="preferences">
              <legend data-agent-content="fieldset-label">Communication Preferences</legend>

              <div class="checkbox-group">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  value="yes"
                  data-agent-field="newsletter-subscription"
                />
                <label for="newsletter" data-agent-content="checkbox-label">
                  Subscribe to BiModal Design updates and implementation tips
                </label>
              </div>

              <div class="checkbox-group">
                <input
                  type="checkbox"
                  id="follow-up"
                  name="follow-up"
                  value="yes"
                  checked
                  data-agent-field="follow-up-permission"
                />
                <label for="follow-up" data-agent-content="checkbox-label">
                  Allow follow-up questions via email
                </label>
              </div>
            </fieldset>

            <div class="form-actions">
              <button
                type="submit"
                class="submit-button"
                data-agent-action="submit-contact-form"
              >
                Send Message
              </button>

              <button
                type="reset"
                class="reset-button"
                data-agent-action="reset-form"
              >
                Clear Form
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>

    <!-- Structured data for contact page -->
    <script type="application/ld+json" set:html={JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact BiModal Design Support",
      "description": pageDescription,
      "url": `${Astro.site}/contact`,
      "mainEntity": {
        "@type": "Organization",
        "name": "BiModal Design Store",
        "email": "support@example.com",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-555-0123",
          "contactType": "Customer Support",
          "availableLanguage": "English",
          "hoursAvailable": "Mo-Fr 09:00-18:00"
        }
      }
    })} />
  </div>
</Layout>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-header h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 1rem;
  }

  .page-header p {
    font-size: 1.125rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .contact-layout {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3rem;
    align-items: start;
  }

  @media (max-width: 768px) {
    .contact-layout {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  .contact-info {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 8px;
  }

  .contact-info h2 {
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .contact-methods {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .contact-method h3 {
    color: #555;
    margin-bottom: 0.5rem;
    font-size: 1.125rem;
  }

  .contact-method p {
    margin: 0.25rem 0;
    color: #666;
  }

  .contact-method a {
    color: #007bff;
    text-decoration: none;
  }

  .contact-method a:hover {
    text-decoration: underline;
  }

  .response-time {
    font-size: 0.875rem;
    font-style: italic;
  }

  .contact-form {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 2rem;
  }

  .contact-form h2 {
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  fieldset {
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  legend {
    font-weight: 600;
    color: #495057;
    padding: 0 0.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }

  small {
    display: block;
    margin-top: 0.25rem;
    color: #6c757d;
    font-size: 0.875rem;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  .checkbox-group input[type="checkbox"] {
    width: auto;
    margin-right: 0.5rem;
    margin-bottom: 0;
  }

  .checkbox-group label {
    margin-bottom: 0;
    font-weight: normal;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  .submit-button, .reset-button {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .submit-button {
    background: #007bff;
    color: white;
  }

  .submit-button:hover {
    background: #0056b3;
  }

  .reset-button {
    background: #6c757d;
    color: white;
  }

  .reset-button:hover {
    background: #545b62;
  }
</style>

<!-- Progressive enhancement script -->
<script>
  // Agent detection and form enhancement
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    const submitButton = form?.querySelector('.submit-button');

    if (form && submitButton) {
      form.addEventListener('submit', function(e) {
        // Add loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Add agent context to form data
        const agentData = document.createElement('input');
        agentData.type = 'hidden';
        agentData.name = 'user_agent';
        agentData.value = navigator.userAgent;
        form.appendChild(agentData);

        // Note: In a real implementation, you'd handle the form submission
        // For this static example, we'll just show the loading state
      });
    }
  });
</script>
```

## Agent Detection Script

### public/scripts/agent-detection.js

```javascript
// BiModal Design Agent Detection and Enhancement Script
(function () {
  'use strict';

  // Agent detection patterns
  const AGENT_PATTERNS = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /automation/i,
    /headless/i,
    /selenium/i,
    /playwright/i,
    /puppeteer/i,
    /curl/i,
    /wget/i,
  ];

  // Detect if current user is an agent
  function detectAgent() {
    const userAgent = navigator.userAgent;
    const isAgent = AGENT_PATTERNS.some((pattern) => pattern.test(userAgent));

    return {
      isAgent,
      userAgent,
      type: isAgent ? userAgent.split(' ')[0] : null,
      timestamp: new Date().toISOString(),
    };
  }

  // Apply agent-specific enhancements
  function applyAgentEnhancements(agentInfo) {
    if (!agentInfo.isAgent) return;

    // Add agent context to document
    document.documentElement.setAttribute('data-agent-context', 'detected');
    document.documentElement.setAttribute('data-agent-type', agentInfo.type);

    // Enhance forms for agents
    enhanceForms();

    // Improve navigation clarity
    enhanceNavigation();

    // Add agent-friendly timestamps
    addTimestamps();

    // Log agent visit (for analytics)
    logAgentVisit(agentInfo);
  }

  function enhanceForms() {
    const forms = document.querySelectorAll('form[data-agent-component]');

    forms.forEach((form) => {
      // Add form metadata
      form.setAttribute('data-agent-enhanced', 'true');

      // Enhance form fields
      const fields = form.querySelectorAll('input, select, textarea');
      fields.forEach((field) => {
        if (field.hasAttribute('required')) {
          field.setAttribute('data-agent-required', 'true');
        }
      });
    });
  }

  function enhanceNavigation() {
    const nav = document.querySelector(
      'nav[data-agent-component="primary-navigation"]'
    );
    if (nav) {
      nav.setAttribute('data-agent-enhanced', 'true');

      // Add breadcrumb information if available
      const currentPage = document.querySelector('[data-agent-page]');
      if (currentPage) {
        const pageType = currentPage.getAttribute('data-agent-page');
        nav.setAttribute('data-agent-current-page', pageType);
      }
    }
  }

  function addTimestamps() {
    // Add page load timestamp for agents
    const timestamp = document.createElement('meta');
    timestamp.name = 'agent-page-loaded';
    timestamp.content = new Date().toISOString();
    document.head.appendChild(timestamp);
  }

  function logAgentVisit(agentInfo) {
    // In a real implementation, you'd send this to your analytics
    if (window.console && window.console.log) {
      console.log('BiModal Design: Agent detected', agentInfo);
    }

    // Could send to analytics endpoint
    // fetch('/api/analytics/agent-visit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(agentInfo)
    // });
  }

  // Initialize agent detection
  function init() {
    const agentInfo = detectAgent();
    applyAgentEnhancements(agentInfo);

    // Make agent info available globally for other scripts
    window.BiModal Design = {
      agentInfo,
      isAgent: agentInfo.isAgent,
      enhance: applyAgentEnhancements,
    };
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

## Testing and Validation

### Testing with Different Agents

```bash
# Test with cURL (basic agent)
curl -H "User-Agent: AgentBot/1.0" https://your-site.com/

# Test with wget
wget --user-agent="TestCrawler/1.0" https://your-site.com/

# Test with custom headers
curl -H "User-Agent: TestAgent/1.0" \
     -H "Accept: text/html,application/xhtml+xml" \
     https://your-site.com/products
```

### Lighthouse CI Integration

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

## Key BiModal Design Implementation Features

1. **Static Generation**: Pre-rendered HTML ensures immediate content
   availability
2. **Progressive Enhancement**: JavaScript enhances the experience without being
   required
3. **Semantic Structure**: Comprehensive use of HTML5 landmarks and ARIA labels
4. **Agent Detection**: Runtime detection with appropriate UI enhancements
5. **Structured Data**: Rich JSON-LD markup for enhanced agent understanding
6. **Performance Optimized**: Minimal JavaScript, optimized assets
7. **Accessibility First**: WCAG compliance ensures broad agent compatibility
8. **SEO Friendly**: Clean URLs, proper meta tags, sitemap generation

## Build and Deployment

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production (generates static files)
npm run build

# Preview production build
npm run preview

# Deploy to static hosting (Netlify, Vercel, etc.)
npm run build && deploy dist/
```

## Performance Benefits for Agents

- **Zero JavaScript Required**: All content accessible without JS execution
- **Fast Initial Load**: Static files serve instantly
- **Predictable Structure**: Consistent HTML patterns across pages
- **Clean Markup**: Minimal unnecessary elements
- **Optimized Assets**: Compressed CSS and images
- **CDN Ready**: Static files work perfectly with global CDNs

This Astro implementation showcases how static site generation can provide
optimal performance for both human users and AI agents while maintaining the
full feature set expected from modern web applications.

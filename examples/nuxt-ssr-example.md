# Nuxt SSR BiModal Design Implementation Example

This example demonstrates how to implement BiModal Design patterns in a Nuxt.js
application with server-side rendering (SSR) to ensure optimal agent
accessibility and user experience.

## Overview

Nuxt.js provides excellent SSR capabilities out of the box, making it an ideal
framework for BiModal Design implementation. This example shows how to structure
a Vue.js application with agent-first design principles while maintaining
excellent human UX.

## Project Structure

```
nuxt-bimodal-app/
├── nuxt.config.ts
├── app.vue
├── pages/
│   ├── index.vue
│   ├── products/
│   │   ├── index.vue
│   │   └── [id].vue
│   └── contact.vue
├── components/
│   ├── AgentNav.vue
│   ├── ProductCard.vue
│   └── ContactForm.vue
├── composables/
│   └── useAgentDetection.ts
├── middleware/
│   └── agent-context.ts
└── server/
    └── api/
        └── agent-info.get.ts
```

## Configuration

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  // Enable SSR (default in Nuxt 3)
  ssr: true,

  // SEO and meta configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'index, follow' },
      ],
    },
  },

  // CSS framework (optional)
  css: ['@/assets/css/main.css'],

  // Modules for enhanced functionality
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  // Runtime config for agent detection
  runtimeConfig: {
    public: {
      agentDetectionEnabled: true,
    },
  },

  // Experimental features for better SSR
  experimental: {
    payloadExtraction: false, // Ensures clean HTML for agents
  },
});
```

## Agent Detection Composable

### composables/useAgentDetection.ts

```typescript
export const useAgentDetection = () => {
  const isAgent = ref(false);
  const agentType = ref<string | null>(null);
  const userAgent = ref('');

  const detectAgent = () => {
    if (process.client) {
      userAgent.value = navigator.userAgent;

      // Common agent patterns
      const agentPatterns = [
        /bot/i,
        /crawler/i,
        /spider/i,
        /automation/i,
        /headless/i,
        /selenium/i,
        /playwright/i,
        /puppeteer/i,
      ];

      isAgent.value = agentPatterns.some((pattern) =>
        pattern.test(userAgent.value)
      );

      if (isAgent.value) {
        agentType.value = userAgent.value.split(' ')[0];
      }
    }
  };

  const getAgentContext = () => ({
    isAgent: isAgent.value,
    type: agentType.value,
    userAgent: userAgent.value,
    timestamp: new Date().toISOString(),
  });

  // Auto-detect on mount
  onMounted(() => {
    detectAgent();
  });

  return {
    isAgent: readonly(isAgent),
    agentType: readonly(agentType),
    userAgent: readonly(userAgent),
    detectAgent,
    getAgentContext,
  };
};
```

## Middleware for Agent Context

### middleware/agent-context.ts

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  // Set agent-friendly meta tags based on route
  const agentMeta = {
    '/': {
      'data-agent-page': 'home',
      'data-agent-intent': 'browse-products',
    },
    '/products': {
      'data-agent-page': 'product-list',
      'data-agent-intent': 'find-product',
    },
    '/contact': {
      'data-agent-page': 'contact',
      'data-agent-intent': 'get-support',
    },
  };

  // Add route-specific agent attributes
  if (process.client) {
    const meta = agentMeta[to.path as keyof typeof agentMeta];
    if (meta) {
      Object.entries(meta).forEach(([key, value]) => {
        document.documentElement.setAttribute(key, value);
      });
    }
  }
});
```

## Main App Structure

### app.vue

```vue
<template>
  <Html lang="en">
    <Head>
      <Title>BiModal Design Nuxt Example</Title>
      <Meta
        name="description"
        content="BiModal Design implementation in Nuxt.js"
      />
    </Head>
    <Body data-agent-framework="nuxt" data-agent-version="3.0">
      <div id="app">
        <header role="banner">
          <AgentNav />
        </header>

        <main role="main" id="main-content">
          <NuxtPage />
        </main>

        <footer role="contentinfo">
          <p>&copy; 2025 BiModal Design Nuxt Example</p>
        </footer>
      </div>
    </Body>
  </Html>
</template>

<script setup>
// Global agent detection
const { detectAgent } = useAgentDetection();

// Detect agents on app mount
onMounted(() => {
  detectAgent();
});
</script>

<style>
/* Agent-friendly base styles */
body {
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  color-scheme: light dark;
}

/* Ensure focus visibility for agents */
*:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Agent-specific optimizations */
[data-agent-context='true'] {
  font-size: 16px;
  line-height: 1.6;
}
</style>
```

## Navigation Component

### components/AgentNav.vue

```vue
<template>
  <nav
    role="navigation"
    aria-label="Main navigation"
    data-agent-component="navigation"
  >
    <div class="nav-container">
      <NuxtLink
        to="/"
        class="logo"
        data-agent-action="go-home"
        aria-label="Go to homepage"
      >
        BiModal Design Store
      </NuxtLink>

      <ul role="list" class="nav-links">
        <li>
          <NuxtLink
            to="/"
            data-agent-action="browse-products"
            :class="{ active: $route.path === '/' }"
          >
            Home
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/products"
            data-agent-action="view-products"
            :class="{ active: $route.path.startsWith('/products') }"
          >
            Products
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/contact"
            data-agent-action="get-support"
            :class="{ active: $route.path === '/contact' }"
          >
            Contact
          </NuxtLink>
        </li>
      </ul>

      <!-- Agent status indicator (development only) -->
      <div
        v-if="isAgent && process.dev"
        class="agent-indicator"
        data-agent-status="detected"
      >
        🤖 Agent Mode: {{ agentType }}
      </div>
    </div>
  </nav>
</template>

<script setup>
const { isAgent, agentType } = useAgentDetection();
</script>

<style scoped>
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
  transition: all 0.2s;
}

.nav-links a:hover,
.nav-links a.active {
  background: #007bff;
  color: white;
}

.agent-indicator {
  background: #28a745;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
</style>
```

## Home Page

### pages/index.vue

```vue
<template>
  <div data-agent-page="home" data-agent-intent="browse-products">
    <section role="banner" class="hero">
      <h1 data-agent-content="page-title">Welcome to BiModal Design Store</h1>
      <p data-agent-content="page-description">
        Discover products designed for both humans and AI agents
      </p>
      <NuxtLink
        to="/products"
        class="cta-button"
        data-agent-action="view-all-products"
        role="button"
      >
        Browse Products
      </NuxtLink>
    </section>

    <section role="region" aria-labelledby="featured-heading">
      <h2 id="featured-heading" data-agent-content="section-title">
        Featured Products
      </h2>

      <div
        class="products-grid"
        data-agent-component="product-list"
        role="list"
      >
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
          role="listitem"
        />
      </div>
    </section>

    <!-- Structured data for agents -->
    <script type="application/ld+json">
      {{ structuredData }}
    </script>
  </div>
</template>

<script setup>
// SEO Meta
useHead({
  title: 'BiModal Design Store - Products for Humans and AI',
  meta: [
    {
      name: 'description',
      content:
        'Browse our collection of products designed for optimal agent and human experience',
    },
  ],
});

// Fetch featured products (SSR)
const { data: featuredProducts } = await $fetch('/api/products/featured');

// Structured data for agents
const structuredData = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BiModal Design Store',
    description: 'Products designed for both humans and AI agents',
    url: 'https://example.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://example.com/products?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  })
);
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  display: inline-block;
  background: white;
  color: #667eea;
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: transform 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}
</style>
```

## Product Card Component

### components/ProductCard.vue

```vue
<template>
  <article
    class="product-card"
    data-agent-component="product-card"
    :data-agent-product-id="product.id"
    itemscope
    itemtype="https://schema.org/Product"
  >
    <img
      :src="product.image"
      :alt="product.name"
      class="product-image"
      itemprop="image"
      data-agent-content="product-image"
    />

    <div class="product-info">
      <h3
        class="product-name"
        itemprop="name"
        data-agent-content="product-name"
      >
        {{ product.name }}
      </h3>

      <p
        class="product-description"
        itemprop="description"
        data-agent-content="product-description"
      >
        {{ product.description }}
      </p>

      <div class="product-meta">
        <span
          class="product-price"
          itemprop="offers"
          itemscope
          itemtype="https://schema.org/Offer"
          data-agent-content="product-price"
        >
          <meta itemprop="currency" content="USD" />
          <span itemprop="price" :content="product.price">
            ${{ product.price }}
          </span>
        </span>

        <span
          class="product-rating"
          data-agent-content="product-rating"
          :aria-label="`Rating: ${product.rating} out of 5 stars`"
        >
          ⭐ {{ product.rating }}/5
        </span>
      </div>

      <NuxtLink
        :to="`/products/${product.id}`"
        class="product-link"
        data-agent-action="view-product-details"
        :data-agent-product-id="product.id"
      >
        View Details
      </NuxtLink>
    </div>
  </article>
</template>

<script setup>
interface Product {
  id: string
  name: string
  description: string
  price: number
  rating: number
  image: string
}

defineProps<{
  product: Product
}>()
</script>

<style scoped>
.product-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.product-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.product-price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #28a745;
}

.product-rating {
  color: #ffc107;
}

.product-link {
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
}

.product-link:hover {
  background: #0056b3;
}
</style>
```

## Contact Form

### pages/contact.vue

```vue
<template>
  <div data-agent-page="contact" data-agent-intent="get-support">
    <h1 data-agent-content="page-title">Contact Us</h1>

    <form
      @submit.prevent="submitForm"
      class="contact-form"
      data-agent-component="contact-form"
      role="form"
      aria-labelledby="contact-heading"
    >
      <fieldset>
        <legend data-agent-content="form-section">Contact Information</legend>

        <div class="form-group">
          <label for="name" data-agent-content="field-label"> Name * </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            data-agent-field="customer-name"
            aria-describedby="name-help"
          />
          <small id="name-help" data-agent-content="field-help">
            Your full name for our records
          </small>
        </div>

        <div class="form-group">
          <label for="email" data-agent-content="field-label"> Email * </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            data-agent-field="customer-email"
            aria-describedby="email-help"
          />
          <small id="email-help" data-agent-content="field-help">
            We'll use this to respond to your inquiry
          </small>
        </div>

        <div class="form-group">
          <label for="subject" data-agent-content="field-label">
            Subject *
          </label>
          <select
            id="subject"
            v-model="form.subject"
            required
            data-agent-field="inquiry-type"
          >
            <option value="">Select a topic</option>
            <option value="product-question">Product Question</option>
            <option value="technical-support">Technical Support</option>
            <option value="billing">Billing</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label for="message" data-agent-content="field-label">
            Message *
          </label>
          <textarea
            id="message"
            v-model="form.message"
            required
            rows="5"
            data-agent-field="customer-message"
            aria-describedby="message-help"
          ></textarea>
          <small id="message-help" data-agent-content="field-help">
            Please provide details about your inquiry
          </small>
        </div>

        <button
          type="submit"
          :disabled="submitting"
          data-agent-action="submit-contact-form"
          class="submit-button"
        >
          {{ submitting ? 'Sending...' : 'Send Message' }}
        </button>
      </fieldset>
    </form>

    <div
      v-if="submitted"
      role="alert"
      data-agent-content="success-message"
      class="success-message"
    >
      Thank you! Your message has been sent successfully.
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Contact Us - BiModal Design Store',
  meta: [
    { name: 'description', content: 'Get in touch with our support team' },
  ],
});

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const submitting = ref(false);
const submitted = ref(false);

const submitForm = async () => {
  submitting.value = true;

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: form,
    });

    submitted.value = true;

    // Reset form
    Object.keys(form).forEach((key) => {
      form[key] = '';
    });
  } catch (error) {
    console.error('Form submission error:', error);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.contact-form {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.submit-button {
  background: #007bff;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-button:hover:not(:disabled) {
  background: #0056b3;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
}
</style>
```

## Server API Example

### server/api/agent-info.get.ts

```typescript
export default defineEventHandler(async (event) => {
  const userAgent = getHeader(event, 'user-agent') || '';

  // Analyze user agent for agent detection
  const isBot = /bot|crawler|spider|automation|headless/i.test(userAgent);

  return {
    userAgent,
    isBot,
    timestamp: new Date().toISOString(),
    agentCapabilities: {
      javascript: !isBot, // Assume bots don't execute JS
      cookies: true,
      localStorage: !isBot,
      forms: true,
      navigation: true,
    },
    recommendations: {
      preferSSR: isBot,
      simplifyUI: isBot,
      enhanceSemantics: isBot,
    },
  };
});
```

## Testing Agent Compatibility

To test this implementation with different agents:

### 1. cURL Test (Basic Agent)

```bash
curl -H "User-Agent: TestBot/1.0" http://localhost:3000/
```

### 2. Puppeteer Test

```javascript
const puppeteer = require('puppeteer');

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3000/');

// Test agent detection
const isAgentDetected = await page.evaluate(() => {
  return document.documentElement.hasAttribute('data-agent-context');
});

console.log('Agent detected:', isAgentDetected);
```

### 3. Playwright Test

```javascript
const { chromium } = require('playwright');

const browser = await chromium.launch();
const page = await browser.newPage({
  userAgent: 'AgentTest/1.0 (compatible; TestingBot)',
});

await page.goto('http://localhost:3000/');

// Verify agent-specific attributes
const agentAttributes = await page.evaluate(() => {
  const elements = document.querySelectorAll('[data-agent-component]');
  return Array.from(elements).map((el) => ({
    tag: el.tagName,
    component: el.getAttribute('data-agent-component'),
  }));
});

console.log('Agent components found:', agentAttributes);
```

## Key BiModal Design Implementation Features

1. **Server-Side Rendering**: All content is available immediately on page load
2. **Semantic HTML Structure**: Proper use of landmarks, headings, and ARIA
   labels
3. **Agent Detection**: Runtime detection with appropriate UI adaptations
4. **Structured Data**: JSON-LD for enhanced agent understanding
5. **Data Attributes**: Comprehensive `data-agent-*` attributes for agent
   guidance
6. **Form Accessibility**: Proper labeling, fieldsets, and validation
7. **Navigation Clarity**: Clear site structure with semantic navigation
8. **Performance Optimization**: SSR ensures fast initial content delivery

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site (optional)
npm run generate
```

This Nuxt.js implementation provides a comprehensive example of BiModal Design
patterns while maintaining excellent performance and user experience for both
human users and AI agents.

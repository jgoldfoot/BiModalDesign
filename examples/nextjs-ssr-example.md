# Next.js SSR BiModal Design Example

This example demonstrates how to implement BiModal Design patterns in a Next.js
application with Server-Side Rendering to ensure **FR-1: Initial Payload
Accessibility** compliance.

## Project Setup

```bash
# Create new Next.js project with SSR
npx create-next-app@latest bimodal-example --typescript --app --src-dir
cd bimodal-example
npm install
```

## Key Implementation: Product Listing Page

### `/src/app/products/page.tsx`

```tsx
import { Metadata } from 'next';

// This runs on the server - ensures FR-1 compliance
async function getProducts() {
  const res = await fetch(`${process.env.API_BASE_URL}/api/products`, {
    cache: 'no-store', // Always fresh for agents
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export const metadata: Metadata = {
  title: 'Products - BiModal Design Demo',
  description: 'Agent-accessible product catalog with semantic structure',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main role="main" data-agent-context="product-catalog">
      <header>
        <h1>Product Catalog</h1>
        <nav role="navigation" aria-label="Product filters">
          <ul>
            <li>
              <a href="/products?category=electronics">Electronics</a>
            </li>
            <li>
              <a href="/products?category=clothing">Clothing</a>
            </li>
            <li>
              <a href="/products?category=books">Books</a>
            </li>
          </ul>
        </nav>
      </header>

      <section aria-labelledby="products-heading">
        <h2 id="products-heading">Available Products</h2>

        <div className="product-grid" data-agent-group="product-list">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <article
      className="product-card"
      data-agent-intent="product-view"
      itemScope
      itemType="https://schema.org/Product"
    >
      <header>
        <h3 itemProp="name">{product.name}</h3>
        <p className="price" itemProp="price">
          ${product.price}
        </p>
      </header>

      <div className="product-details">
        <p itemProp="description">{product.description}</p>
        <span
          itemProp="availability"
          content={product.inStock ? 'InStock' : 'OutOfStock'}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <footer className="product-actions">
        <button
          type="button"
          data-agent-action="add-to-cart"
          data-agent-product-id={product.id}
          aria-describedby={`product-${product.id}-status`}
          disabled={!product.inStock}
        >
          Add to Cart
        </button>

        <div
          id={`product-${product.id}-status`}
          aria-live="polite"
          className="status-message"
        >
          {product.inStock ? 'Available' : 'Currently unavailable'}
        </div>
      </footer>

      {/* Structured data for agents */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            offers: {
              '@type': 'Offer',
              price: product.price,
              availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
          }),
        }}
      />
    </article>
  );
}
```

## BiModal Design-Optimized Checkout Form

### `/src/app/checkout/page.tsx`

```tsx
'use client';

import { useState } from 'react';

export default function CheckoutPage() {
  const [formState, setFormState] = useState('ready');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');

    // Form submission logic here

    setFormState('success');
  };

  return (
    <main role="main" data-agent-context="checkout-flow">
      <h1>Checkout</h1>

      <form
        onSubmit={handleSubmit}
        data-agent-intent="order-completion"
        data-agent-state={formState}
        noValidate
      >
        {/* Shipping Information */}
        <fieldset data-agent-group="shipping-info">
          <legend>Shipping Information</legend>

          <div className="form-group">
            <label htmlFor="shipping-name">Full Name *</label>
            <input
              id="shipping-name"
              type="text"
              data-agent-field="shipping.fullName"
              aria-required="true"
              aria-describedby="shipping-name-error"
              autoComplete="shipping name"
            />
            <div
              id="shipping-name-error"
              className="error-message"
              aria-live="polite"
            />
          </div>

          <div className="form-group">
            <label htmlFor="shipping-address">Street Address *</label>
            <input
              id="shipping-address"
              type="text"
              data-agent-field="shipping.address"
              aria-required="true"
              aria-describedby="shipping-address-error"
              autoComplete="shipping street-address"
            />
            <div
              id="shipping-address-error"
              className="error-message"
              aria-live="polite"
            />
          </div>
        </fieldset>

        {/* Payment Information */}
        <fieldset data-agent-group="payment-info">
          <legend>Payment Information</legend>

          <div className="form-group">
            <label htmlFor="card-number">Card Number *</label>
            <input
              id="card-number"
              type="text"
              data-agent-field="payment.cardNumber"
              aria-required="true"
              aria-describedby="card-number-error card-number-help"
              autoComplete="cc-number"
            />
            <div id="card-number-help" className="help-text">
              16-digit card number
            </div>
            <div
              id="card-number-error"
              className="error-message"
              aria-live="polite"
            />
          </div>
        </fieldset>

        {/* Submit Actions */}
        <div className="form-actions" data-agent-group="checkout-actions">
          <button
            type="submit"
            data-agent-action="complete-order"
            data-agent-state={formState}
            aria-describedby="checkout-status"
            disabled={formState === 'submitting'}
          >
            {formState === 'submitting' ? 'Processing...' : 'Complete Order'}
          </button>

          <div
            id="checkout-status"
            className="status-message"
            aria-live="polite"
          >
            {formState === 'ready' && 'Ready to place order'}
            {formState === 'submitting' && 'Processing your order...'}
            {formState === 'success' && 'Order completed successfully!'}
          </div>
        </div>
      </form>
    </main>
  );
}
```

## API Route for Agent Access

### `/src/app/api/products/route.ts`

```tsx
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  // Mock data - replace with real database
  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      description: 'High-quality wireless headphones',
      category: 'electronics',
      inStock: true,
    },
    {
      id: 2,
      name: 'Cotton T-Shirt',
      price: 24.99,
      description: 'Comfortable cotton t-shirt',
      category: 'clothing',
      inStock: false,
    },
  ];

  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products;

  // Agent-friendly response headers
  const response = NextResponse.json({
    products: filteredProducts,
    total: filteredProducts.length,
    bimodalDesign: {
      version: '2.1',
      capabilities: ['product-search', 'add-to-cart', 'checkout'],
      endpoints: {
        'add-to-cart': '/api/cart/add',
        checkout: '/api/checkout',
      },
    },
  });

  // CORS for agent access
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('X-BiModal Design-Compatible', 'true');

  return response;
}
```

## Testing FR-1 Compliance

### Verify Server-Side Rendering

```bash
# Test that content is visible to agents
curl -s http://localhost:3000/products | grep "Wireless Headphones"

# Should return the product name, proving SSR works
```

### Disable JavaScript Test

1. Open Chrome DevTools
2. Settings → Preferences → Debugger → "Disable JavaScript"
3. Navigate to your site
4. Verify core functionality still works

## Key BiModal Design Features Demonstrated

✅ **FR-1 Compliance**: Server-side rendering ensures content in initial
payload  
✅ **Semantic HTML**: Proper landmarks, headings, form structure  
✅ **Agent Attributes**: data-agent-\* attributes for automation  
✅ **Structured Data**: JSON-LD for enhanced agent understanding  
✅ **Stable Selectors**: Consistent IDs and classes  
✅ **State Management**: aria-live regions and data-agent-state  
✅ **API Integration**: Agent-friendly endpoints with metadata

## Running the Example

```bash
# Install dependencies
npm install

# Set environment variables
echo "API_BASE_URL=http://localhost:3000" > .env.local

# Run development server
npm run dev

# Visit http://localhost:3000/products
```

## Agent Testing

```bash
# Test with cURL (simulates basic agent)
curl -H "User-Agent: BiModal Design-Test/1.0" http://localhost:3000/products

# Test API endpoint
curl http://localhost:3000/api/products?category=electronics
```

This example provides a complete foundation for building agent-accessible
Next.js applications while maintaining excellent human user experience.

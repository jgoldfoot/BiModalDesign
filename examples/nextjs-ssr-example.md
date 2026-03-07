# Next.js SSR BiModal Design v3.0 Example

This example demonstrates how to implement BiModal Design v3.0 patterns in a
Next.js application with Server-Side Rendering, ensuring compliance across all
five Defense in Depth layers.

## Project Setup

```bash
npx create-next-app@latest bimodal-example --typescript --app --src-dir
cd bimodal-example
npm install
```

## Key Implementation: Product Listing Page

### `/src/app/products/page.tsx`

```tsx
import { Metadata } from 'next';

// Server component: ensures Layer 1 (FR-1) compliance
async function getProducts() {
  const res = await fetch(`${process.env.API_BASE_URL}/api/products`, {
    cache: 'no-store',
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
    <>
      {/* Layer 2: Semantic HTML5 structure with ARIA */}
      <main aria-label="Product catalog">
        <header>
          <h1>Product Catalog</h1>
          <nav aria-label="Product filters">
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

          <div className="product-grid">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      {/* Layer 3: JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Product Catalog',
            numberOfItems: products.length,
            itemListElement: products.map((p: any, i: number) => ({
              '@type': 'Product',
              position: i + 1,
              name: p.name,
              description: p.description,
              offers: {
                '@type': 'Offer',
                price: p.price,
                priceCurrency: 'USD',
                availability: p.inStock
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              },
            })),
          }),
        }}
      />
    </>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <article
      className="product-card"
      itemScope
      itemType="https://schema.org/Product"
    >
      <header>
        <h3 itemProp="name">{product.name}</h3>
      </header>

      <div className="product-details">
        <p itemProp="description">{product.description}</p>
        <div
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <span className="price" itemProp="price" content={String(product.price)}>
            ${product.price}
          </span>
          <meta itemProp="priceCurrency" content="USD" />
          <link
            itemProp="availability"
            href={
              product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock'
            }
          />
        </div>
        <span aria-label={product.inStock ? 'In stock' : 'Out of stock'}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <footer className="product-actions">
        <button
          type="button"
          aria-label={`Add ${product.name} to cart`}
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
    </article>
  );
}
```

## Checkout Form (Layer 2: Semantic Forms)

### `/src/app/checkout/page.tsx`

```tsx
'use client';

import { useState } from 'react';

export default function CheckoutPage() {
  const [formState, setFormState] = useState<'ready' | 'submitting' | 'success'>('ready');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Form submission logic here
    setFormState('success');
  };

  return (
    <main aria-label="Checkout">
      <h1>Checkout</h1>

      <form
        onSubmit={handleSubmit}
        aria-label="Order completion"
        aria-busy={formState === 'submitting'}
        noValidate
      >
        {/* Shipping Information */}
        <fieldset>
          <legend>Shipping Information</legend>

          <div className="form-group">
            <label htmlFor="shipping-name">Full Name *</label>
            <input
              id="shipping-name"
              type="text"
              name="shipping_name"
              aria-required="true"
              aria-describedby="shipping-name-error"
              autoComplete="shipping name"
            />
            <div id="shipping-name-error" aria-live="polite" />
          </div>

          <div className="form-group">
            <label htmlFor="shipping-address">Street Address *</label>
            <input
              id="shipping-address"
              type="text"
              name="shipping_address"
              aria-required="true"
              autoComplete="shipping street-address"
            />
          </div>
        </fieldset>

        {/* Submit Actions */}
        <div className="form-actions">
          <button
            type="submit"
            aria-label="Complete order"
            aria-describedby="checkout-status"
            disabled={formState === 'submitting'}
          >
            {formState === 'submitting' ? 'Processing...' : 'Complete Order'}
          </button>

          <div id="checkout-status" aria-live="polite">
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

## API Route (Layer 4: API Surface)

### `/src/app/api/products/route.ts`

```tsx
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

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

  return NextResponse.json({
    products: filteredProducts,
    total: filteredProducts.length,
  });
}
```

## Testing FR-1 Compliance

### Verify Server-Side Rendering

```bash
# Layer 1: Content visible to Level 0 agents
curl -s http://localhost:3000/products | grep "Wireless Headphones"
# Should return the product name, proving SSR works

# Layer 3: Structured data present
curl -s http://localhost:3000/products | grep "application/ld+json"
# Should find JSON-LD block
```

### Disable JavaScript Test

1. Open Chrome DevTools
2. Settings > Preferences > Debugger > "Disable JavaScript"
3. Navigate to your site
4. Verify core functionality still works

## BiModal Design v3.0 Layers Demonstrated

- **Layer 1 (FR-1)**: Server components render content in initial HTML
- **Layer 2**: Semantic landmarks (`<main>`, `<nav>`, `<header>`), ARIA labels,
  heading hierarchy, accessible forms with `<fieldset>` and `<label>`
- **Layer 3**: schema.org microdata (`itemscope`, `itemprop`) and JSON-LD
- **Layer 4**: REST API with typed responses

## Running the Example

```bash
npm install
echo "API_BASE_URL=http://localhost:3000" > .env.local
npm run dev
# Visit http://localhost:3000/products
```

## Agent-Level Testing

```bash
# Level 0 (HTTP Retriever): Content in HTML?
curl -s http://localhost:3000/products | grep -c '<article'

# Level 1 (LLM Browser): Structured data?
curl -s http://localhost:3000/products | grep "schema.org"

# Level 4 (Tool-Use Agent): API access?
curl http://localhost:3000/api/products?category=electronics
```

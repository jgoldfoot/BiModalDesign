# Documentation drift report [2026-06-17]

## README.md vs docs/whitepaper.md

### [VARIATION] Design Principles (Structured Data)

- **README.md** (Line 101):

> Layer 3: Structured Data (schema.org, JSON-LD) → Level 1-3

- **docs/whitepaper.md** (Line 257):

> Layer 3: Structured Data (schema.org, JSON-LD, OG) → Level 1-3 agents

## README.md vs tools/validators/fr1-checker.js

### [DRIFT] FR-1 Checker scope definition

- **README.md** (Line 271):

> - **FR-1 Checker** (`fr1-checker.js`) — comprehensive Layer 1-2 audit with

- **tools/validators/fr1-checker.js** (Line 9):

> \* FR-1 Checker - Test Initial Payload Accessibility

## README.md vs examples/

### [DRIFT] Code snippet parity

- **README.md** (Lines 162-169):

> <!-- Layer 2: Semantic structure with ARIA -->
> <article class="product-card" itemscope itemtype="https://schema.org/Product">
>   <h2 itemprop="name">Pro Agent License</h2>
>   <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
>     <span itemprop="price" content="99.00">$99/mo</span>
>     <meta itemprop="priceCurrency" content="USD" />
>   </div>

- **examples/ssr-pass-example.html** (Lines 210-216):

> <article class="product-card" itemscope itemtype="https://schema.org/Product">
>   <img src="https://via.placeholder.com/250x200/4A90E2/fff?text=Headphones" alt="Wireless Headphones" />
>   <h2 class="product-title" itemprop="name">Wireless Headphones</h2>
>   <p class="product-description" itemprop="description">Premium noise-cancelling over-ear headphones</p>
>   <div class="product-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
>     <span itemprop="price" content="99.99">$99.99</span>
>     <meta itemprop="priceCurrency" content="USD" />
>   </div>

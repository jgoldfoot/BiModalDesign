## 2024-05-25 - Focus Styles for Keyboard Navigation
**Learning:** Found that the dynamically added 'Add to Cart' buttons in `examples/ssr-pass-example.html` lacked explicit focus-visible styles, which is critical for keyboard accessibility. While they are `<button>` elements, adding custom styles overrides some default focus rings.
**Action:** Always ensure that interactive elements have clear focus states, especially when applying custom CSS that might remove or obscure default browser focus rings.

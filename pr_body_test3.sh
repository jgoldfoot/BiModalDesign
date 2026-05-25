pr_body="🎨 Palette: Improved keyboard navigation and focus styles

💡 What:
- Added \`.product-card:focus-within\` to provide the same elevation effect as \`:hover\` for keyboard users.
- Extracted inline styles for the dynamically added Add to Cart button into a new \`.add-to-cart-btn\` CSS class.
- Added explicit \`:hover\` and \`:focus-visible\` styles to the button to ensure clear interactive feedback.

🎯 Why:
Previously, keyboard users tabbing through the product list did not receive the visual elevation feedback that mouse users got on hover. Additionally, the inline-styled buttons lacked clear focus and hover states, reducing discoverability and confidence during keyboard navigation.

♿ Accessibility:
- Better visual tracking for screen reader and keyboard-only users navigating interactive elements.
- Ensures focus rings are prominent and distinct using \`outline\` and \`outline-offset\`.

*Note: Added a critical learning to \`.Jules/palette.md\` regarding dynamically generated elements and focus states.*"

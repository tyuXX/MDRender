# MDRender

A lightweight, customizable markdown renderer for web applications. MDRender converts markdown text into styled HTML with support for dark mode and custom theming.

## Features

- 📝 Full markdown support including:
  - Headings (h1-h6)
  - Bold and italic text
  - Code blocks with language highlighting
  - Inline code
  - Lists (ordered and unordered)
  - Blockquotes
  - Links
  - Tables
  - Images
- 🎨 Customizable themes via CSS variables
- 🌙 Built-in dark mode support
- 🎯 Zero dependencies
- 📱 Responsive design
- 🚀 Simple API

## Getting Started

### 1. Include the Required Files

```html
<link rel="stylesheet" href="https://raw.githubusercontent.com/tyuXX/MDRender/refs/heads/main/css/markdown.css">
<script src="https://raw.githubusercontent.com/tyuXX/MDRender/refs/heads/main/js/renderer.js"></script>
```

### 2. Initialize the Renderer

```javascript
const renderer = new MDRenderer();
```

### 3. Convert Markdown to HTML

```javascript
const markdown = "# Hello World\nThis is **markdown**!";
const html = renderer.render(markdown);
// Output: <div class="mdrender"><h1>Hello World</h1><p>This is <strong>markdown</strong>!</p></div>
```

### 4. Display the Result

```javascript
document.getElementById('output').innerHTML = html;
```

## Customizing Styles

### Basic Theme Customization

Override the default colors by setting CSS variables:

```css
.mdrender {
    --md-text: #333;          /* Main text color */
    --md-header: #2c3e50;     /* Heading color */
    --md-code-bg: #f8f9fa;    /* Code background */
    --md-blockquote: #666;    /* Blockquote text color */
    --md-link: #3498db;       /* Link color */
    --md-border: #ddd;        /* Border color */
}
```

### Dark Mode Support

Add dark mode styles by using the `data-theme` attribute:

```css
[data-theme="dark"] .mdrender {
    --md-text: #e0e0e0;
    --md-header: #60a5fa;
    --md-code-bg: #2d2d2d;
    --md-blockquote: #a0a0a0;
    --md-link: #60a5fa;
    --md-border: #404040;
}
```

Toggle dark mode with JavaScript:

```javascript
// Enable dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Enable light mode
document.documentElement.setAttribute('data-theme', 'light');
```

## Complete Example

Here's a complete example showing how to use MDRender in your project:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>MDRender Example</title>
    <link rel="stylesheet" href="markdown.css">
</head>
<body>
    <div id="output"></div>

    <script src="renderer.js"></script>
    <script>
        // Initialize renderer
        const renderer = new MDRenderer();

        // Your markdown content
        const markdown = `
# Welcome to MDRender

This is a **bold** statement and this is *italic*.

## Code Example
\`\`\`javascript
function hello() {
    console.log('Hello, World!');
}
\`\`\`

> This is a blockquote

1. Ordered list item 1
2. Ordered list item 2

- Unordered list item
- Another item

[Visit our website](https://example.com)
        `;

        // Render and display
        document.getElementById('output').innerHTML = renderer.render(markdown);
    </script>
</body>
</html>
```

## Supported Markdown Syntax

- Headings: `# H1` through `###### H6`
- Bold: `**bold text**`
- Italic: `*italic text*`
- Code blocks: ````javascript code here```
- Inline code: `` `code` ``
- Lists:
  - Unordered: `- item`
  - Ordered: `1. item`
- Blockquotes: `> quote`
- Links: `[text](url)`
- Images: `![alt](url)`
- Tables:
  ```
  | Header | Header |
  |--------|--------|
  | Cell   | Cell   |
  ```

## Browser Support

MDRender works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this in your own projects!

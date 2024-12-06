document.addEventListener('DOMContentLoaded', function() {
    const renderer = new MDRenderer();
    const input = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');
    const htmlOutput = document.getElementById('html-output');
    const themeToggle = document.getElementById('theme-toggle');
    const copyHtmlBtn = document.getElementById('copy-html');
    const clearInputBtn = document.getElementById('clear-input');
    const refreshPreviewBtn = document.getElementById('refresh-preview');
    const togglePreviewBtn = document.getElementById('toggle-preview');
    const formatHtmlBtn = document.getElementById('format-html');
    const exampleSelect = document.getElementById('example-select');

    // Theme handling
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Example markdown templates
    const examples = {
        basic: `# Basic Markdown Example
## Headers

You can write headers from h1 to h6 using # symbols.

## Text Formatting

*This text is italic*
**This text is bold**
***This text is bold and italic***
~~This text is strikethrough~~
==This text is highlighted==

## Lists

### Unordered List
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

### Ordered List
1. First item
2. Second item
   1. Nested item
   2. Another nested item
3. Third item

## Links and Images

[Visit MDRender](https://github.com/yourusername/MDRender)
![Sample Image](https://via.placeholder.com/150 "Sample image")

## Code

Inline \`code\` looks like this.

\`\`\`javascript
// Code block
function hello() {
    console.log("Hello, world!");
}
\`\`\`

## Blockquotes

> This is a blockquote
> It can span multiple lines
>> And can be nested`,

        advanced: `# Advanced Features

## Task Lists
- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task

## Tables
| Header 1 | Header 2 | Header 3 |
|:---------|:--------:|---------:|
| Left     | Center   | Right    |
| aligned  | aligned  | aligned  |

## Footnotes
Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.

## Definition Lists
Term 1
: Definition 1
: Another definition

Term 2
: Definition 2

## Abbreviations
*[HTML]: HyperText Markup Language
*[CSS]: Cascading Style Sheets

HTML and CSS are web technologies.

## Superscript and Subscript
E = mc^2^
H~2~O

## Emojis
:smile: :heart: :thumbsup: :rocket:`,

        tables: `# Table Examples

## Simple Table
| Name    | Age | City     |
|---------|-----|----------|
| John    | 25  | New York |
| Alice   | 30  | London   |
| Bob     | 28  | Paris    |

## Table with Alignment
| Left     | Center   | Right    |
|:---------|:--------:|---------:|
| Text     | Text     | Text     |
| Left     | Center   | Right    |

## Complex Table
| Feature | Basic | Pro | Enterprise |
|:--------|:------|:---:|----------:|
| Users   | 10    | 100 | Unlimited |
| Storage | 5GB   | 50GB| 500GB     |
| Support | Email | 24/7| Priority  |
| Price   | Free  | $10 | Custom    |`,

        footnotes: `# Document with Footnotes

## Introduction
This is a sample document[^1] that demonstrates the use of footnotes[^2].

You can use footnotes to add additional information[^details] or references[^ref].

## Main Content
The content continues here with another footnote[^3].

[^1]: This is the first footnote.
[^2]: Footnotes can contain multiple lines
    and even include code blocks.
[^details]: You can use any text as the footnote identifier.
[^ref]: Reference: *Markdown Guide*, 2021
[^3]: This is the last footnote.

## Using Named Footnotes
You can refer to the same footnote[^details] multiple times.`,

        default: `# MDRender Feature Showcase
Welcome to MDRender! This example demonstrates all supported features.

## 1. Text Formatting

### Basic Formatting
Regular text
*Italic text* or _italic text_
**Bold text** or __bold text__
***Bold and italic*** or ___bold and italic___
~~Strikethrough text~~
==Highlighted text==

### Superscript and Subscript
E = mc^2^
H~2~O
X^2^ + Y^2^ = Z^2^

## 2. Headers
# H1 Header
## H2 Header
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header

## 3. Lists

### Unordered Lists
- First level
  - Second level
    - Third level
      - Fourth level
- Another item
  * Mixed markers
  + Are supported

### Ordered Lists
1. First item
2. Second item
   1. Nested item
   2. Another nested
      1. Deep nested
3. Third item

### Task Lists
- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task
  - [ ] Nested task
  - [x] Completed nested task

### Definition Lists
Term 1
: First definition
: Second definition

Complex Term
: Definition with *inline* formatting
: Another definition with **bold** text

## 4. Code

### Inline Code
Use \`const x = 42;\` for inline code.

### Code Blocks
\`\`\`javascript
// JavaScript code
function greet(name) {
    console.log(\`Hello, \${name}!\`);
}

// Call the function
greet('World');
\`\`\`

\`\`\`python
# Python code
def factorial(n):
    return 1 if n <= 1 else n * factorial(n - 1)

print(factorial(5))  # Output: 120
\`\`\`

## 5. Blockquotes

> Single level quote
> Multiple lines
> In the same quote

> Nested quotes
>> Second level
>>> Third level
>>>> Fourth level

## 6. Links and Images

### Links
[Basic link](https://example.com)
[Link with title](https://example.com "Visit example.com")
[Reference link][ref1]
[Another reference][ref2]

[ref1]: https://example.com "Reference 1"
[ref2]: https://example.com "Reference 2"

### Images
![Basic image](https://via.placeholder.com/150)
![Image with title](https://via.placeholder.com/150 "Sample image")
[![Clickable image](https://via.placeholder.com/150)](https://example.com)

## 7. Tables

### Basic Table
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

### Aligned Table
| Left | Center | Right |
|:-----|:------:|------:|
| 1    | 2      | 3     |
| 4    | 5      | 6     |

### Complex Table
| Feature | Basic | Pro | Enterprise |
|:--------|:------|:---:|----------:|
| Users   | 10    | 100 | Unlimited |
| Storage | 5GB   | 50GB| 500GB     |
| Support | Email | 24/7| Priority  |
| Price   | Free  | $10 | Custom    |

## 8. Footnotes
Here's a sentence with a footnote[^1].
Here's another with a named footnote[^note].
And one more[^2].

[^1]: Basic footnote content.
[^note]: Named footnote with multiple paragraphs.
    
    Indent paragraphs to include them in the footnote.
[^2]: Another simple footnote.

## 9. Abbreviations
HTML and CSS are web technologies.
The WHO was founded in 1948.

*[HTML]: HyperText Markup Language
*[CSS]: Cascading Style Sheets
*[WHO]: World Health Organization

## 10. Horizontal Rules

Three or more hyphens:
---

Three or more asterisks:
***

Three or more underscores:
___

## 11. Emojis
:smile: :heart: :thumbsup: :rocket:
:star: :fire: :sunny: :moon:
:coffee: :pizza: :cake: :apple:

## 12. Special Characters & Escaping
\* Escaped asterisk
\_ Escaped underscore
\# Escaped hash
\[ Escaped bracket
\] Escaped bracket
\` Escaped backtick
\( Escaped parenthesis
\) Escaped parenthesis
\~ Escaped tilde
\: Escaped colon

## 13. HTML Support
<div style="color: blue;">
  This is <em>HTML</em> content with <strong>inline styles</strong>.
</div>

<details>
  <summary>Click to expand</summary>
  This is expandable content using HTML tags.
</details>

---

That's all! This document showcases every feature supported by MDRender. Feel free to edit and experiment with the content!`
    };

    // Update preview and HTML output
    function updateOutput() {
        const markdown = input.value;
        const html = renderer.render(markdown);
        preview.innerHTML = html;
        htmlOutput.textContent = html;
    }

    // Event listeners
    input.addEventListener('input', updateOutput);

    copyHtmlBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(htmlOutput.textContent)
            .then(() => {
                const originalText = copyHtmlBtn.textContent;
                copyHtmlBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyHtmlBtn.textContent = originalText;
                }, 2000);
            });
    });

    clearInputBtn.addEventListener('click', () => {
        input.value = '';
        updateOutput();
    });

    refreshPreviewBtn.addEventListener('click', updateOutput);

    togglePreviewBtn.addEventListener('click', () => {
        preview.style.display = preview.style.display === 'none' ? 'block' : 'none';
        togglePreviewBtn.textContent = preview.style.display === 'none' ? 'Show Preview' : 'Hide Preview';
    });

    formatHtmlBtn.addEventListener('click', () => {
        const formatted = html_beautify(htmlOutput.textContent, {
            indent_size: 2,
            wrap_line_length: 80,
            preserve_newlines: true,
            max_preserve_newlines: 2
        });
        htmlOutput.textContent = formatted;
    });

    exampleSelect.addEventListener('change', () => {
        const selected = exampleSelect.value;
        if (selected && examples[selected]) {
            input.value = examples[selected];
            updateOutput();
        }
    });

    // Initial render with default content
    input.value = examples.default;
    updateOutput();
});
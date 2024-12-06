document.addEventListener('DOMContentLoaded', () => {
    const renderer = new MDRenderer();
    const editor = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');
    const copyButton = document.getElementById('copy-html');
    const themeToggle = document.getElementById('theme-toggle');

    // Theme handling
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    function updatePreview() {
        const markdown = editor.value;
        const html = renderer.render(markdown);
        preview.innerHTML = html;
        document.getElementById('html-output').textContent = html;
    }

    editor.addEventListener('input', updatePreview);
    
    copyButton.addEventListener('click', () => {
        const htmlOutput = document.getElementById('html-output');
        navigator.clipboard.writeText(htmlOutput.textContent)
            .then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy HTML';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
    });

    // Load default example
    editor.value = `# Welcome to MDRender

This is a simple markdown renderer. Try editing this text!

## Features:
- **Bold text** and *italic text*
- Lists (like this one!)
- Links: [Visit GitHub](https://github.com)
- Code: \`console.log('Hello World!')\`
- And more...

### Code Blocks
\`\`\`javascript
function hello() {
    console.log('Hello, World!');
}
\`\`\`

> Blockquotes are supported too!

1. Ordered lists
2. Work as well
3. Try them out!
`;
    
    // Initial render
    updatePreview();
});
class MDRenderer {
    constructor() {
        this.rules = {
            heading: /^(#{1,6})\s+(.+)$/gm,
            paragraph: /^(?!#|>|\s*\d+\.|```|\s*-\s)(.+)$/gm,
            bold: /\*\*(.+?)\*\*/g,
            italic: /\*(.+?)\*/g,
            code: /`(.+?)`/g,
            codeblock: /```(\w*)\n([\s\S]*?)```/g,
            link: /\[(.+?)\]\((.+?)\)/g,
            list: /^(\s*)-\s(.+)$/gm,
            orderedList: /^(\s*)\d+\.\s(.+)$/gm,
            blockquote: /^>\s(.+)$/gm,
        };
    }

    render(markdown) {
        let html = markdown;

        // Convert code blocks first to prevent interference
        html = this.renderCodeBlocks(html);
        
        // Convert block elements
        html = this.renderBlockquotes(html);
        html = this.renderHeadings(html);
        html = this.renderLists(html);
        html = this.renderOrderedLists(html);
        html = this.renderParagraphs(html);

        // Convert inline elements
        html = this.renderBold(html);
        html = this.renderItalic(html);
        html = this.renderInlineCode(html);
        html = this.renderLinks(html);

        // Wrap the content in a div with the mdrender class
        return `<div class="mdrender">${html}</div>`;
    }

    renderHeadings(text) {
        return text.replace(this.rules.heading, (match, level, content) => {
            const headingLevel = level.length;
            return `<h${headingLevel}>${content}</h${headingLevel}>`;
        });
    }

    renderParagraphs(text) {
        return text.replace(this.rules.paragraph, (match, content) => {
            return `<p>${content}</p>`;
        });
    }

    renderBold(text) {
        return text.replace(this.rules.bold, '<strong>$1</strong>');
    }

    renderItalic(text) {
        return text.replace(this.rules.italic, '<em>$1</em>');
    }

    renderInlineCode(text) {
        return text.replace(this.rules.code, '<code>$1</code>');
    }

    renderCodeBlocks(text) {
        return text.replace(this.rules.codeblock, (match, language, code) => {
            return `<pre><code class="language-${language}">${code.trim()}</code></pre>`;
        });
    }

    renderLinks(text) {
        return text.replace(this.rules.link, '<a href="$2">$1</a>');
    }

    renderLists(text) {
        const items = [];
        let lastIndentLevel = 0;
        let html = text.replace(this.rules.list, (match, indent, content) => {
            const indentLevel = indent.length;
            if (indentLevel > lastIndentLevel) {
                items.push('<ul>');
            } else if (indentLevel < lastIndentLevel) {
                items.push('</ul>');
            }
            lastIndentLevel = indentLevel;
            items.push(`<li>${content}</li>`);
            return '';
        });
        
        while (lastIndentLevel > 0) {
            items.push('</ul>');
            lastIndentLevel--;
        }
        
        return html + items.join('');
    }

    renderOrderedLists(text) {
        const items = [];
        let lastIndentLevel = 0;
        let html = text.replace(this.rules.orderedList, (match, indent, content) => {
            const indentLevel = indent.length;
            if (indentLevel > lastIndentLevel) {
                items.push('<ol>');
            } else if (indentLevel < lastIndentLevel) {
                items.push('</ol>');
            }
            lastIndentLevel = indentLevel;
            items.push(`<li>${content}</li>`);
            return '';
        });
        
        while (lastIndentLevel > 0) {
            items.push('</ol>');
            lastIndentLevel--;
        }
        
        return html + items.join('');
    }

    renderBlockquotes(text) {
        return text.replace(this.rules.blockquote, '<blockquote>$1</blockquote>');
    }
}
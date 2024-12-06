class MDRenderer {
    constructor() {
        this.rules = {
            heading: /^(#{1,6})\s+(.+)$/gm,
            paragraph: /^(?!#|>|\s*\d+\.|```|\s*-\s|\s*\*\s|\||\s*\[\s*[x\s]\s*\]|\^\[\d+\]|\s*={3,}|\s*-{3,})(.+)$/gm,
            bold: /\*\*(.+?)\*\*/g,
            italic: /\*(.+?)\*/g,
            strikethrough: /~~(.+?)~~/g,
            code: /`(.+?)`/g,
            codeblock: /```(\w*)\n([\s\S]*?)```/g,
            link: /\[(.+?)\]\((.+?)(?:\s+"(.+?)")?\)/g,
            image: /!\[(.+?)\]\((.+?)(?:\s+"(.+?)")?\)/g,
            list: /^(\s*)[*-]\s(.+)$/gm,
            orderedList: /^(\s*)\d+\.\s(.+)$/gm,
            blockquote: /^>\s(.+)$/gm,
            horizontalRule: /^([-*_])\1{2,}$/gm,
            table: /^\|(.+)\|$/gm,
            tableDelimiter: /^\|(?:[-:]+[-| :]*)\|$/gm,
            taskList: /^(\s*)-\s\[([ x])\]\s(.+)$/gm,
            superscript: /\^(.+?)\^/g,
            subscript: /~(.+?)~/g,
            highlight: /==(.+?)==/g,
            footnoteRef: /\[\^(\d+)\]/g,
            footnote: /^\[\^(\d+)\]:\s(.+)$/gm,
            abbreviation: /\*\[(.+?)\]:\s(.+)$/gm,
            definition: /^:\s(.+?)\n\s{2,}(.+)$/gm,
            emoji: /:([\w+-]+):/g,
        };

        this.footnotes = new Map();
        this.abbreviations = new Map();
        this.emojis = {
            'smile': '😊',
            'laugh': '😄',
            'wink': '😉',
            'heart': '❤️',
            'check': '✅',
            'x': '❌',
            'warning': '⚠️',
            'info': 'ℹ️',
            // Add more emojis as needed
        };
    }

    render(markdown) {
        let html = markdown;

        // Reset collections
        this.footnotes.clear();
        this.abbreviations.clear();

        // Pre-process footnotes and abbreviations
        html = this.collectFootnotes(html);
        html = this.collectAbbreviations(html);

        // Convert code blocks first to prevent interference
        html = this.renderCodeBlocks(html);
        
        // Convert block elements
        html = this.renderHorizontalRules(html);
        html = this.renderBlockquotes(html);
        html = this.renderHeadings(html);
        html = this.renderTables(html);
        html = this.renderTaskLists(html);
        html = this.renderLists(html);
        html = this.renderOrderedLists(html);
        html = this.renderDefinitions(html);
        html = this.renderParagraphs(html);

        // Convert inline elements
        html = this.renderBold(html);
        html = this.renderItalic(html);
        html = this.renderStrikethrough(html);
        html = this.renderHighlight(html);
        html = this.renderSuperscript(html);
        html = this.renderSubscript(html);
        html = this.renderInlineCode(html);
        html = this.renderImages(html);
        html = this.renderLinks(html);
        html = this.renderFootnoteRefs(html);
        html = this.renderEmojis(html);

        // Add footnotes section if any exist
        if (this.footnotes.size > 0) {
            html += this.renderFootnotesSection();
        }

        // Wrap the content in a div with the mdrender class
        return `<div class="mdrender">${html}</div>`;
    }

    renderHeadings(text) {
        return text.replace(this.rules.heading, (match, level, content) => {
            const headingLevel = level.length;
            const id = content.toLowerCase().replace(/[^\w]+/g, '-');
            return `<h${headingLevel} id="${id}">${content}</h${headingLevel}>`;
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

    renderStrikethrough(text) {
        return text.replace(this.rules.strikethrough, '<del>$1</del>');
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
        return text.replace(this.rules.link, (match, text, url, title) => {
            const titleAttr = title ? ` title="${title}"` : '';
            return `<a href="${url}"${titleAttr}>${text}</a>`;
        });
    }

    renderImages(text) {
        return text.replace(this.rules.image, (match, alt, url, title) => {
            const titleAttr = title ? ` title="${title}"` : '';
            return `<img src="${url}" alt="${alt}"${titleAttr}>`;
        });
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

    renderHorizontalRules(text) {
        return text.replace(this.rules.horizontalRule, '<hr>');
    }

    renderTables(text) {
        let html = text;
        let inTable = false;
        let alignment = [];
        
        // Split into lines
        const lines = html.split('\n');
        const newLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (this.rules.tableDelimiter.test(line)) {
                // Get alignment info
                alignment = line.split('|').slice(1, -1).map(cell => {
                    cell = cell.trim();
                    if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
                    if (cell.endsWith(':')) return 'right';
                    return 'left';
                });
                continue;
            }
            
            if (this.rules.table.test(line)) {
                const cells = line.split('|').slice(1, -1);
                
                if (!inTable) {
                    inTable = true;
                    newLines.push('<table>');
                    newLines.push('<thead>');
                    newLines.push('<tr>');
                    cells.forEach((cell, index) => {
                        const align = alignment[index] ? ` style="text-align: ${alignment[index]}"` : '';
                        newLines.push(`<th${align}>${cell.trim()}</th>`);
                    });
                    newLines.push('</tr>');
                    newLines.push('</thead>');
                    newLines.push('<tbody>');
                } else {
                    newLines.push('<tr>');
                    cells.forEach((cell, index) => {
                        const align = alignment[index] ? ` style="text-align: ${alignment[index]}"` : '';
                        newLines.push(`<td${align}>${cell.trim()}</td>`);
                    });
                    newLines.push('</tr>');
                }
            } else if (inTable) {
                inTable = false;
                newLines.push('</tbody>');
                newLines.push('</table>');
                newLines.push(line);
            } else {
                newLines.push(line);
            }
        }
        
        if (inTable) {
            newLines.push('</tbody>');
            newLines.push('</table>');
        }
        
        return newLines.join('\n');
    }

    renderTaskLists(text) {
        return text.replace(this.rules.taskList, (match, indent, checked, content) => {
            const checkbox = `<input type="checkbox" ${checked === 'x' ? 'checked' : ''} disabled>`;
            return `${indent}<li class="task-list-item">${checkbox} ${content}</li>`;
        });
    }

    renderSuperscript(text) {
        return text.replace(this.rules.superscript, '<sup>$1</sup>');
    }

    renderSubscript(text) {
        return text.replace(this.rules.subscript, '<sub>$1</sub>');
    }

    renderHighlight(text) {
        return text.replace(this.rules.highlight, '<mark>$1</mark>');
    }

    collectFootnotes(text) {
        return text.replace(this.rules.footnote, (match, ref, content) => {
            this.footnotes.set(ref, content);
            return '';
        });
    }

    renderFootnoteRefs(text) {
        return text.replace(this.rules.footnoteRef, (match, ref) => {
            if (this.footnotes.has(ref)) {
                return `<sup class="footnote-ref"><a href="#fn${ref}" id="fnref${ref}">${ref}</a></sup>`;
            }
            return match;
        });
    }

    renderFootnotesSection() {
        if (this.footnotes.size === 0) return '';
        
        let html = '<section class="footnotes"><hr><ol>';
        for (const [ref, content] of this.footnotes) {
            html += `
                <li id="fn${ref}">
                    ${content}
                    <a href="#fnref${ref}" class="footnote-backref">↩</a>
                </li>`;
        }
        html += '</ol></section>';
        return html;
    }

    collectAbbreviations(text) {
        return text.replace(this.rules.abbreviation, (match, abbr, definition) => {
            this.abbreviations.set(abbr, definition);
            return '';
        });
    }

    renderDefinitions(text) {
        return text.replace(this.rules.definition, '<dl><dt>$1</dt><dd>$2</dd></dl>');
    }

    renderEmojis(text) {
        return text.replace(this.rules.emoji, (match, name) => {
            return this.emojis[name] || match;
        });
    }
}
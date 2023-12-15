import { Node } from '@tiptap/core';
import { md } from './MarkdownNodeView';

export const MarkdownNode = Node.create({
    name: 'markdown',
    
    group: 'block',
    atom: true,
    
    parseHTML() {
      return [
        {
          tag: 'div.markdown-content',
        },
      ];
    },
    
    renderHTML({ node }) {
      const contentAsMarkdown = node.textContent;
      const contentAsHTML = md.render(contentAsMarkdown);
      return ['div', { class: 'markdown-content' }, contentAsHTML];
    }
  });
  
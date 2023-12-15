import { NodeViewRenderer } from "@tiptap/react";

import MarkdownIt from "markdown-it";

// Initialize markdown-it
export const md = new MarkdownIt();

// Custom rule to handle LaTeX (this is a very basic example; in practice, you'd want more advanced rules)
md.inline.ruler.before("escape", "latex", (state, silent) => {
    const content = state.src.slice(state.pos);
    const latexMatch = content.match(/\$([^\$]+)\$/); // matches inline LaTeX between dollar signs
    if (latexMatch) {
        if (!silent) {
            // Add token for further rendering
            const token = state.push("latex_inline", "math", 0);
            token.content = latexMatch[1];
            token.markup = "$";
        }
        state.pos += latexMatch[0].length;
        return true;
    }
    return false;
});

// Render function for the above rule
md.renderer.rules["latex_inline"] = (tokens, idx) => {
    return "\\(" + tokens[idx].content + "\\)"; // Render as LaTeX (change this to render with KaTeX or MathJax if preferred)
};

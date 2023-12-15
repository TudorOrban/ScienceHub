import { Plugin, PluginKey } from "prosemirror-state";
import { Node } from "prosemirror-model";
import { md } from "./MarkdownNodeView";

export const markdownCursorPluginKey = new PluginKey('markdownCursor');

export const markdownCursorPlugin = new Plugin({
    key: markdownCursorPluginKey,
    view(editorView) {
      return {
        update: (view, prevState) => {
          const { state } = view;
          if (prevState.doc.eq(state.doc) && prevState.selection.eq(state.selection)) return;
  
          state.doc.descendants((node, pos) => {
            if (node.type.name === "markdown") {
              const domNode = editorView.nodeDOM(pos) as HTMLElement;
              const { from, to } = state.selection;
              const nodeStart = pos;
              const nodeEnd = pos + node.nodeSize;
              const isInside = to > nodeStart && from < nodeEnd;
  
              if (isInside) {
                domNode.textContent = node.textContent || "";  // Display raw markdown
              } else {
                domNode.innerHTML = md.render(node.textContent || ""); // Render markdown
              }
            }
          });
        }
      };
    }
  });
  

import { Extension } from "@tiptap/core";

export const MarkdownCursorExtension = Extension.create({
  name: "markdownCursor",

  addProseMirrorPlugins() {
    return [
      markdownCursorPlugin,
    ];
  },
});

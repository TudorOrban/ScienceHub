import {
    mathPlugin,
    REGEX_INLINE_MATH_DOLLARS,
} from "@benrbray/prosemirror-math";
import { callOrReturn, InputRule, mergeAttributes, Node } from "@tiptap/core";

/**
 * Configuring inline math for the UnifiedEditor.
 */
export const MathInline = Node.create({
    name: "math_inline",
    group: "inline math",
    content: "text*",
    inline: true,
    atom: true,

    parseHTML() {
        return [
            {
                tag: "math-inline",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "math-inline",
            mergeAttributes({ class: "math-node" }, HTMLAttributes),
            0,
        ];
    },

    addProseMirrorPlugins() {
        return [mathPlugin];
    },

    addInputRules() {
        return [
            new InputRule({
                find: REGEX_INLINE_MATH_DOLLARS,
                handler: ({ state, range, match }) => {
                    const getAttributes = undefined;
                    const nodeType = this.type;
                    const start = range.from;
                    const end = range.to;
                    const $start = state.doc.resolve(start);
                    const index = $start.index();
                    const $end = state.doc.resolve(end);
                    // get attrs
                    const attributes =
                        callOrReturn(getAttributes, undefined, match) || {};
                    // check if replacement valid
                    if (
                        !$start.parent.canReplaceWith(
                            index,
                            $end.index(),
                            nodeType
                        )
                    ) {
                        return null;
                    }
                    // perform replacement
                    const transaction = state.tr.replaceRangeWith(
                        start,
                        end,
                        nodeType.create(
                            attributes,
                            nodeType.schema.text(match[1])
                        )
                    );

                    return;
                },
            }),
        ];
    },
});

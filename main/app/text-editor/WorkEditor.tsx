import { Work } from "@/types/workTypes";
import { Editor, EditorContent, Extensions, useEditor } from "@tiptap/react";
import { useEffect } from "react";

interface WorkEditorProps {
    keyProp: string;
    work: Work;
    extensions: Extensions;
    editorProps: {
        attributes: {
            // class: "z-10 w-[595px] h-[842px] flex-none focus:outline-none bg-white border-x border-gray-200 shadow-sm",
            class: string;
        };
    };
    onFocus: (editor: Editor | null) => void;
}

const WorkEditor: React.FC<WorkEditorProps> = ({ keyProp, work, extensions, editorProps, onFocus }) => {
    const editor = useEditor({
        extensions,
        content: work.description || "",
        editorProps,
        onFocus: () => onFocus(editor),
    });

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(work.description || "");
        }
    }, [work]);

    return editor ? (
        <div key={keyProp}>
            <EditorContent editor={editor} className="" id={work.id.toString()} />
        </div>
    ) : null;
};

export default WorkEditor;

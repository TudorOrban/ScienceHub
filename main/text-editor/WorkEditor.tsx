import { Work } from "@/types/workTypes";
import { Editor, EditorContent, Extensions, useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";

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
    editorWidth?: number;
    onFocus: (editor: Editor | null) => void;
}

const WorkEditor: React.FC<WorkEditorProps> = ({
    keyProp,
    work,
    extensions,
    editorProps,
    editorWidth,
    onFocus,
}) => {
    const [currentContent, setCurrentContent] = useState(work?.description || "");

    const editor = useEditor({
        extensions,
        content: currentContent,
        editorProps,
        onFocus: () => onFocus(editor),
        onUpdate: ({ editor }) => {
            setCurrentContent(editor.getHTML());
        },
    });
    

    useEffect(() => {
        if (editor && work) {
            setCurrentContent(work.description || "");
            editor.commands.setContent(work.description || "");
        }
    }, [work]);

    useEffect(() => {
        if (editor && !!work) {
            // SetContent(editor.getHTML());
            work.isChanged = !(work?.description === editor?.getHTML());
        }
    }, [editor?.getHTML()]);
    console.log("DSAASDA", editor?.getHTML());

    return editor ? (
        <div key={keyProp} style={{ width: (editorWidth + "px") || "50px" }}>
            <EditorContent editor={editor} className={``} id={work?.id.toString()} />
        </div>
    ) : null;
};

export default WorkEditor;

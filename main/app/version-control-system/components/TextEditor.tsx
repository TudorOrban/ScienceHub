import { TextDiff } from "@/types/versionControlTypes";
import { useEffect, useState } from "react";
import { calculateDiffs } from "../diff-logic/calculateDiffs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type TextEditorProps = {
    initialText: string;
    onUpdate: (newText: string) => void;
};

const TextEditor: React.FC<TextEditorProps> = ({ initialText, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentText, setCurrentText] = useState(initialText);

    const handleToggle = () => {
        if (isEditing) {
            onUpdate(currentText);
        }
        setIsEditing(!isEditing);
    };

    const [rows, setRows] = useState(1);

    useEffect(() => {
        const textareaLineHeight = 20; // Adjust this depending on your styling
        const lines = currentText.split("\n").length;

        // Calculate the number of rows needed (considering line breaks in the text)
        setRows(lines + currentText.split(" ").length / 10);
    }, [currentText]);

    return (
        <div>
            <div className="w-full">
                {isEditing ? (
                    <Textarea
                        value={currentText}
                        onChange={(e) => setCurrentText(e.target.value)}
                        rows={rows}
                        className="w-full border border-white text-base p-0"
                    />
                ) : (
                    <div>{currentText}</div>
                )}
            </div>
            <div className="flex justify-end mt-2">
                <Button onClick={handleToggle}>
                    {isEditing ? "Save" : "Edit"}
                </Button>
            </div>
        </div>
    );
};

export default TextEditor;

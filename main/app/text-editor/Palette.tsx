import Menubar from "@/components/light-simple-elements/Menubar";
import Select, {
    SelectOption,
} from "@/components/light-simple-elements/Select";
import { useState } from "react";
import {
    fontOptions,
    headingOptions,
    menubarItems,
    textColorOptions,
    textSizeOptions,
} from "./PaletteOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { Editor } from "@tiptap/react";

interface PaletteProps {
    editor: Editor;
    onSave?: () => void;
}

export const Palette: React.FC<PaletteProps> = ({ editor, onSave }) => {
    // States
    const [currentTextColor, setCurrentTextColor] = useState<SelectOption>({
        label: "Black",
        value: "black",
    });
    const [currentTextSize, setCurrentTextSize] = useState<SelectOption>({
        label: "12",
        value: "12",
    });
    const [currentFont, setCurrentFont] = useState<SelectOption>({
        label: "Arial",
        value: "Arial",
    });
    const [currentHeading, setCurrentHeading] = useState<SelectOption>({
        label: "Normal text",
        value: "0",
    });

    // Handlers
    const isActive = (format: string) => {
        return editor?.isActive(format) || false;
    };

    const toggleBold = (e: React.MouseEvent) => {
        editor.chain().focus().toggleBold().run();
    };

    const toggleItalic = (e: React.MouseEvent) => {
        editor.chain().focus().toggleItalic().run();
    };

    const toggleUnderline = (e: React.MouseEvent) => {
        editor.chain().focus().toggleUnderline().run();
    };

    return (
        <div className="w-full bg-gray-50 border-b border-gray-200 rounded-b-sm shadow-sm">
            {/* Menubar */}
            <div className="flex items-start justify-between">
                <Menubar items={menubarItems} className="" />
                <button
                    onClick={onSave || (() => {})}
                    className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white border border-gray-300 rounded-md"
                >
                    <FontAwesomeIcon
                        icon={faSave}
                        className="small-icon text-white mr-1"
                    />
                    Save
                </button>
            </div>

            {/* Editing Options */}
            <div className="p-4 flex items-center space-x-4">
                <Select
                    selectOptions={fontOptions}
                    currentSelection={currentFont}
                    setCurrentSelection={(selection: SelectOption) => {
                        setCurrentFont(selection);
                        editor
                            .chain()
                            .focus()
                            .setFontFamily(selection.value || "")
                            .run();
                    }}
                />
                <Select
                    selectOptions={textSizeOptions}
                    currentSelection={currentTextSize}
                    setCurrentSelection={(selection: SelectOption) => {
                        setCurrentTextSize(selection);
                        editor
                            .chain()
                            .focus()
                            .setFontSize(selection.value + "pt")
                            .run();
                    }}
                />
                <Select
                    selectOptions={textColorOptions}
                    currentSelection={currentTextColor}
                    setCurrentSelection={(selection: SelectOption) => {
                        setCurrentTextColor(selection);
                        editor.chain().focus().setColor(selection.value || "").run();
                    }}
                />
                <Select
                    selectOptions={headingOptions}
                    currentSelection={currentHeading}
                    setCurrentSelection={(selection: SelectOption) => {
                        setCurrentHeading(selection);
                        // if (selection.value !== "0") {
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run();
                        // }
                    }}
                />

                <div className="flex items-center space-x-2">
                    <button
                        onClick={toggleBold}
                        className={`w-8 h-8 border border-gray-300 rounded focus:outline-none hover:bg-gray-200 ${
                            isActive("bold") ? "bg-gray-200" : "bg-white"
                        }`}
                    >
                        B
                    </button>

                    <button
                        onClick={toggleItalic}
                        className={`w-8 h-8 border border-gray-300 rounded focus:outline-none hover:bg-gray-200 ${
                            isActive("italic") ? "bg-gray-200" : "bg-white"
                        }`}
                    >
                        I
                    </button>

                    <button
                        onClick={toggleUnderline}
                        className={`w-8 h-8 border border-gray-300 rounded focus:outline-none hover:bg-gray-200 ${
                            isActive("underline") ? "bg-gray-200" : "bg-white"
                        }`}
                    >
                        U
                    </button>
                </div>
            </div>
        </div>
    );
};

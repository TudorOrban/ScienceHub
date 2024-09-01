import Menubar from "@/src/components/light-simple-elements/Menubar";
import Select, { SelectOption } from "@/src/components/light-simple-elements/Select";
import { useState } from "react";
import {
    fontOptions,
    headingOptions,
    getMenubarItems,
    textColorOptions,
    textSizeOptions,
} from "./PaletteOptions";
import { Editor } from "@tiptap/react";

interface PaletteProps {
    editor: Editor;
}

export const Palette: React.FC<PaletteProps> = ({ editor }) => {
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
        return editor?.isActive(format);
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
        <div className="w-full bg-gray-100 rounded-b-sm shadow-sm z-30">
            {/* Menubar */}
            <Menubar items={getMenubarItems()} className="" />

            {/* Editing Options */}
            <div className="p-2 flex items-center space-x-2">
                <Select
                    selectOptions={fontOptions}
                    currentSelection={currentFont}
                    setCurrentSelection={(selection: SelectOption) => {
                        setCurrentFont(selection);
                        editor
                            .chain()
                            .focus()
                            .setFontFamily(selection.value?.toString() || "")
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
                        editor
                            .chain()
                            .focus()
                            .setColor(selection.value?.toString() || "")
                            .run();
                    }}
                />
                <Select
                    selectOptions={headingOptions}
                    currentSelection={currentHeading}
                    setCurrentSelection={(selection: SelectOption) => {
                        setCurrentHeading(selection);
                        // if (selection.value !== "0") {
                        editor.chain().focus().toggleHeading({ level: 2 }).run();
                        // }
                    }}
                />

                <div className="flex items-center" style={{ fontWeight: 500 }}>
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

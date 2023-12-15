import { useState, useRef, useEffect } from "react";

const TextEditor: React.FC = () => {
    const [content, setContent] = useState<string>("");
    const [isBoldOn, setIsBoldOn] = useState<boolean>(false);
    const [isBoldModeOn, setIsBoldModeOn] = useState<boolean>(false);
    const editableDivRef = useRef<HTMLDivElement>(null);
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);

    const handleDivChange = () => {
        if (editableDivRef.current) {
            setContent(editableDivRef.current.innerHTML);
        }
    };

    

    const toggleBold = () => {
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;
    
        const range = selection.getRangeAt(0);
        const isTextSelected = !range.collapsed;
    
        if (isTextSelected) {
            const selectedContents = range.extractContents();
            if (!isBoldOn) {
                const boldNode = document.createElement("strong");
                boldNode.appendChild(selectedContents);
                range.insertNode(boldNode);
            } else {
                let container = document.createDocumentFragment();
                container.appendChild(selectedContents);
                range.insertNode(container);
            }
        } else {
            if (!isBoldOn) {
                // Introduce blank bold node at cursor position
                const newNode = document.createElement("b");
                range.insertNode(newNode);
                range.setStartAfter(newNode);
                range.setEndAfter(newNode);
            } else {
                // Remove blank bold node at cursor position
                if (range.startContainer.nodeType === Node.ELEMENT_NODE && range.startContainer.nodeName === "B") {
                    let textNode = document.createTextNode(range.startContainer.textContent || "");
                    (range.startContainer as ChildNode).replaceWith(textNode);
                    range.setStartAfter(textNode);
                    range.setEndAfter(textNode);
                }
            }
        }
    
        setIsBoldOn(!isBoldOn);
    };
    


    const toggleBoldTest = () => {
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        const isTextSelected = !range.collapsed;

        if (isTextSelected) {
            if (!isBoldOn) {
                // Introduce bold node with selected text
                // Not trivial because of overlapping: we have to split the text into islands of not-already-bold text and add nodes for each, so as to not bolden twice and stuff
            } else {
                // Remove any bold nodes that are within the selected text; for bold nodes that are only partially in the selected text, remove them but add others in for the remaining, non-selected text (or cut the initial node if possible)
            };
        } else {
            if (!isBoldOn) {
                // Introduce blank bold node at cursor position
            } else {
                // Remove blank bold node at cursor position (if it exists)
            };
        };

        setIsBoldOn(!isBoldOn);
    };

    const handleDivTest = () => {
        // Bolden text that is written in a bold node, thats it
    }

    // Handle cursor movement with arrow keys
    const handleArrowKeys = (event: KeyboardEvent) => {
        const selection = window.getSelection();
        if (!selection) return;

        const range = selection.getRangeAt(0).cloneRange();

        if (event.key === "ArrowLeft") {
            if (range.startOffset > 0) {
                range.setStart(range.startContainer, range.startOffset - 1);
                range.setEnd(range.startContainer, range.startOffset);
            }
        } else if (event.key === "ArrowRight") {
            if (range.startOffset < range.startContainer.textContent!.length) {
                range.setStart(range.startContainer, range.startOffset + 1);
                range.setEnd(range.startContainer, range.startOffset);
            }
        }
        // For up and down arrows, a more complex logic can be implemented later considering line breaks
        selection.removeAllRanges();
        selection.addRange(range);
    };

    useEffect(() => {
        if (!editableDivRef.current) return;

        // editableDivRef.current.addEventListener("input", handleDivInput);
        editableDivRef.current.addEventListener("keydown", handleArrowKeys);

        // Cleanup to avoid memory leaks
        return () => {
            editableDivRef.current?.removeEventListener(
                "keydown",
                handleArrowKeys
            );
            // editableDivRef.current?.removeEventListener(
            //     "input",
            //     handleDivInput
            // );
        };
    }, []);

    console.log("DASJDA", isBoldOn);

    return (
        <div className="container max-w-xl mx-auto mt-10 p-6 border border-gray-300 shadow-md">
            {/* Toolbar */}
            <div className="toolbar mb-4">
                <button
                    onClick={toggleBold}
                    className={`px-4 py-2 mr-2 ${
                        isBoldOn
                            ? "font-bold text-black"
                            : "font-normal text-gray-800"
                    } border border-gray-300 rounded-md hover-bg-gray-100`}
                >
                    B
                </button>
            </div>

            {/* Editor */}
            <div
                ref={editableDivRef}
                contentEditable={true}
                className="w-full h-60 p-2 border border-gray-300"
                dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Dev */}
            <div className="container max-w-xl mx-auto mt-10 p-6 border border-gray-300 shadow-md">
                <h2 className="mb-4">Editor Content (Debug):</h2>
                <div>{content}</div>
            </div>
        </div>
    );
};

export default TextEditor;


// const toggleBold = () => {
    //     const selection = window.getSelection();
    //     if (!selection || !selection.rangeCount) return;

    //     const range = selection.getRangeAt(0);
    //     const isTextSelected = !range.collapsed;
    //     // console.log("dasldasda", selection, isTextSelected);

    //     if (isTextSelected) {
    //         // When text is selected
    //         if (isBoldModeOn) {
    //             const boldNodes: Node[] = [];
    //             range
    //                 .cloneContents()
    //                 .querySelectorAll("b")
    //                 .forEach((node) => boldNodes.push(node));

    //             if (isBoldOn) {
    //                 if (boldNodes.length > 0) {
    //                     boldNodes.forEach((boldNode) => {
    //                         const textNode = document.createTextNode(
    //                             boldNode.textContent || ""
    //                         );
    //                         (boldNode as ChildNode).replaceWith(textNode);
    //                     });
    //                 }
    //             } else {
    //                 const newNode = document.createElement("b");
    //                 newNode.appendChild(range.extractContents());
    //                 range.insertNode(newNode);
    //             }
    //         }

    //         setIsBoldOn(!isBoldOn);
    //     } else {
    //         // When no text is selected, toggle the bold mode
    //         setIsBoldOn(!isBoldOn);
    //     }

    //     // Reflect changes to the content state
    //     if (editableDivRef.current) {
    //         setContent(editableDivRef.current.innerHTML);
    //     }
    // };

    // const handleDivInput = (e: any) => {
    //     // console.log("Input event triggered");
    //     // console.log("SopwoqDADAS", isBoldOn)
    //     // if (isBoldOn) {
    //         const selection = window.getSelection();
    //         // console.log("DASDASDA", selection)
    //         if (selection && selection.rangeCount > 0) {
    //             // console.log("DSADAS", selection.rangeCount);
    //             const range = selection.getRangeAt(0);
    //             const newNode = document.createElement("b");
    //             newNode.textContent = e.data; // Newly typed character
    //             range.insertNode(newNode);
    //             range.setStartAfter(newNode);
    //             range.setEndAfter(newNode);
    //             selection.removeAllRanges();
    //             selection.addRange(range);
    //             e.preventDefault(); // Prevent default to avoid the character being added twice
    //         }
    //     // }
    // };
// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import ReactQuill, { Quill } from "react-quill";
// import "react-quill/dist/quill.snow.css";
// // Import the new Mathjax class

// import { MathjaxBlot } from "../../../MathjaxBlot";

// Quill.register("formats/mathjax", MathjaxBlot);

// const availableFonts = [
//     "Arial",
//     "Verdana",
//     "Times New Roman",
//     "Georgia",
//     "Courier New",
// ];

// export default function ResearchScorePage() {
//     const [editorHtml, setEditorHtml] = useState<string>("");
//     const [editorFont, setEditorFont] = useState<string>(availableFonts[0]);
//     const quillRef = useRef<any>(null); // TypeScript ref for the Quill editor
//     const [displayedSvg, setDisplayedSvg] = useState<string>("");

//     const handleChange = (html: string) => {
//         setEditorHtml(html);
//     };

//     const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setEditorFont(event.target.value);
//     };

//     const toggleFormat = (format: string) => {
//         const quill = quillRef.current.getEditor();
//         const currentFormat = quill.getFormat();
//         quill.format(format, !currentFormat[format]);
//     };

//     function isCursorInsideLatexBlock(
//         quill: any,
//         cursorPosition: number
//     ): boolean {
//         const [blot] = quill.getLeaf(cursorPosition);
//         if (blot instanceof MathjaxBlot) {
//             return true;
//         }

//         // Additional check for unrendered LaTeX
//         const textBeforeCursor = quill.getText(0, cursorPosition);
//         const openingCount = (textBeforeCursor.match(/\$\$/g) || []).length;
//         const textAfterCursor = quill.getText(cursorPosition);
//         const closingCount = (textAfterCursor.match(/\$\$/g) || []).length;

//         return openingCount % 2 === 1 && closingCount % 2 === 1;
//     }

//     function adjustCursorPosition(quill: any) {
//         const cursorPosition = quill.getSelection()?.index || 0;
//         if (isCursorInsideLatexBlock(quill, cursorPosition)) {
//             const blotStart = quill.getIndex(quill.getLeaf(cursorPosition)[0]);
//             const blotEnd =
//                 blotStart + quill.getLeaf(cursorPosition)[0].length();
//             if (cursorPosition === blotEnd) {
//                 quill.setSelection(blotEnd + 1, 0);
//             }
//         }
//     }

//     function handleTextChange(delta: any, oldDelta: any, source: string) {
//         if (source !== "user") return;

//         const quill = quillRef.current.getEditor();
//         const cursorPosition = quill.getSelection()?.index || 0;
//         const originalLength = quill.getLength();

//         console.log("Cursor Position:", cursorPosition);
//         console.log(
//             "Is inside LaTeX block:",
//             isCursorInsideLatexBlock(quill, cursorPosition)
//         );

//         // If cursor is inside an unrendered LaTeX block, return early
//         const textBeforeCursor = quill.getText(0, cursorPosition);
//         const openingCount = (textBeforeCursor.match(/\$\$/g) || []).length;
//         const textAfterCursor = quill.getText(cursorPosition);
//         const closingCount = (textAfterCursor.match(/\$\$/g) || []).length;

//         if (openingCount % 2 === 1 && closingCount % 2 === 1) {
//             console.log("Cursor inside unrendered LaTeX. Exiting early.");
//             return;
//         }

//         // If cursor is inside a rendered LaTeX block, unrender it
//         const [blot] = quill.getLeaf(cursorPosition);
//         console.log("Blot type:", blot, blot instanceof MathjaxBlot);

//         if (blot instanceof MathjaxBlot) {
//             const blotStart = quill.getIndex(blot);
//             const blotEnd = blotStart + blot.length();
//             const latexString = MathjaxBlot.value(blot.domNode);

//             quill.deleteText(blotStart, blotEnd);
//             quill.insertText(blotStart, `$$${latexString}$$`);

//             // Add the cursor adjustment code here
//             const newLength = quill.getLength();
//             const lengthDifference = newLength - originalLength;
//             quill.setSelection(cursorPosition + lengthDifference);

//             return;
//         }

//         // Iterate over the entire text and render any unrendered LaTeX
//         const text = quill.getText();
//         const latexRegex = /\$\$(.*?)\$\$/g;
//         let match: RegExpExecArray | null;

//         while ((match = latexRegex.exec(text)) !== null) {
//             const start = match.index;
//             const end = start + match[0].length;
//             const latexString = match[1];

//             console.log(
//                 "Match start:",
//                 start,
//                 "Match end:",
//                 end,
//                 "LaTeX String:",
//                 latexString
//             );

//             if (cursorPosition >= start && cursorPosition <= end + 1) continue;

//             try {
//                 quill.deleteText(start, end);
//                 quill.insertEmbed(start, "mathjax", latexString);
//             } catch (error) {
//                 console.error("Error generating SVG:", error);
//             }
//         }

//         // Add the cursor adjustment code here, after the loop
//         const newLength = quill.getLength();
//         const lengthDifference = newLength - originalLength;
//         quill.setSelection(cursorPosition + lengthDifference);
//     }

//     useEffect(() => {
//         const quill = quillRef.current.getEditor();
//         quill.on("text-change", handleTextChange);
//         quill.on("selection-change", handleTextChange);
//         return () => {
//             quill.off("text-change", handleTextChange);
//             quill.off("selection-change", handleTextChange);
//         };
//     }, []);

//     useEffect(() => {
//         const editorElem = document.querySelector(".ql-editor") as HTMLElement;
//         if (editorElem) {
//             editorElem.style.fontFamily = editorFont;
//         }
//     }, [editorFont]);

//     return (
//         <div className="m-10 border border-gray-200">
//             <div id="testLatex" style={{ visibility: "visible" }}>
//                 $$\int$$
//             </div>
//             <select onChange={handleFontChange}>
//                 {availableFonts.map((font) => (
//                     <option value={font} key={font}>
//                         {font}
//                     </option>
//                 ))}
//             </select>
//             <button onClick={() => toggleFormat("bold")}>Bold</button>
//             <button onClick={() => toggleFormat("italic")}>Italic</button>
//             <button onClick={() => toggleFormat("underline")}>Underline</button>
//             {/* Add your other custom buttons here */}
//             <ReactQuill
//                 ref={quillRef}
//                 value={editorHtml}
//                 onChange={handleTextChange}
//                 modules={{ toolbar: false }}
//                 formats={["latex", "bold", "italic", "underline", "mathjax"]}
//             />
//             <div>
//                 <h2>HTML Output</h2>
//                 <div
//                     dangerouslySetInnerHTML={{ __html: editorHtml }}
//                     style={{ fontFamily: editorFont }}
//                 />
//             </div>
//             {/* <button onClick={renderLatex}>Render LaTeX</button> */}
//             {/* <button onClick={() => setDisplayedSvg(svg)}>Display SVG</button> */}
//             <div dangerouslySetInnerHTML={{ __html: displayedSvg }} />
//         </div>
//     );
// }

// // function renderLatex() {
// //     const quill = quillRef.current.getEditor();
// //     const range = quill.getSelection();
// //     const start = range ? range.index : 0;
// //     const end = range ? start + range.length : quill.getLength();
// //     const text = quill.getText(start, end - start);
// //     const latexRegex = /\$\$(.*?)\$\$/g;
// //     let match: RegExpExecArray | null;

// //     while ((match = latexRegex.exec(text)) !== null) {
// //         const latexStart = start + match.index;
// //         const latexEnd = latexStart + match[0].length;
// //         const latexString = match[1];
// //         quill.deleteText(latexStart, latexEnd);
// //         quill.insertEmbed(latexStart, 'mathjax', latexString);
// //     }
// // }

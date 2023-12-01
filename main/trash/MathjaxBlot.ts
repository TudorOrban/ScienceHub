// import Quill from "quill";
// const Parchment = Quill.import("parchment");

// export class MathjaxBlot extends Parchment.Embed {
//     static create(value: string) {
//         const node = super.create(value);
//         node.innerHTML = this.tex2svg(value);
//         node.setAttribute('data-value', value);
//         node.contentEditable = 'false';
//         return node;
//     }
    
//     static value(node: any): string {
//         return node.getAttribute("data-value") || "";
//     }

//     static tex2svg(latex: string): string {
//         let MathJaxNode = document.createElement("DIV");
//         MathJaxNode.style.visibility = "hidden";
//         MathJaxNode.innerHTML = `\\(${latex}\\)`;
//         document.body.appendChild(MathJaxNode);
//         window.MathJax.typeset([MathJaxNode]);
//         let svg = MathJaxNode.innerHTML;
//         document.body.removeChild(MathJaxNode);
//         return svg;
//     }
// }


// MathjaxBlot.blotName = "mathjax";
// MathjaxBlot.className = "ql-mathjax";
// MathjaxBlot.tagName = "SPAN";

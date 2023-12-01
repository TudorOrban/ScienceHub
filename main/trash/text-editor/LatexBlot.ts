// // Top-level imports
// import Quill from "quill";

// declare global {
//     interface Window {
//         MathJax: any;
//     }
// }


// // // Initialize MathJax once when your application starts
// // MathJax.init({
// //     //... your configuration here
// // });



// // Define the Quill embedding for MathJax
// const Embed = Quill.import("blots/embed");

// export class LatexBlot extends Embed {
//     static create(value: string): Node {
//         let node = super.create(value) as HTMLElement;
        
//         if (typeof window !== 'undefined' && window.MathJax) {
//             window.MathJax.tex2chtmlPromise(value, {
//                 display: true,
//             }).then((latexNode: any) => {
//                 const latexOutput = latexNode.outerHTML; // Get the HTML string of the rendered LaTeX
//                 console.log(latexOutput);
//                 node.innerHTML = latexOutput; // Set the innerHTML of the Quill node to the rendered LaTeX
//             });
//         }
    
//         return node;
//     }
    
    

//     static value(node: HTMLElement): string {
//         return node.innerText;
//     }
// }

// LatexBlot.blotName = "latex";
// LatexBlot.tagName = "span";
// LatexBlot.className = "latex-embed";


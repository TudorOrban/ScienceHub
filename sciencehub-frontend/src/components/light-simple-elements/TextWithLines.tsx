/**
 * Simple component to display text with new lines.
 * Will be upgraded to a full mini-editor in the future.
 */
export const DisplayTextWithNewLines = ({ text }: { text: string }) => {
    const correctedText = text.replace(/\\n/g, "\n");
    return <p style={{ whiteSpace: "pre-line" }}>{correctedText}</p>;
};

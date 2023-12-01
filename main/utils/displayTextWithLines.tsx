export const DisplayTextWithNewLines = ({ text }: { text: string }) => {
    const correctedText = text.replace(/\\n/g, '\n');
    return (
      <div style={{ whiteSpace: "pre-line" }}>
        {correctedText}
      </div>
    );
  };
  
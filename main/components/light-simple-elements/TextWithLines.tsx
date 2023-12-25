export const DisplayTextWithNewLines = ({ text }: { text: string }) => {
    const correctedText = text.replace(/\\n/g, '\n');
    return (
      <p style={{ whiteSpace: "pre-line" }}>
        {correctedText}
      </p>
    );
  };
  
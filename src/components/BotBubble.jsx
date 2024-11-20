import React, { useState, useEffect } from "react";
import MoleculeRenderer from "./MoleculeRenderer";

// Function to simulate the typewriter effect
function useTypewriterEffect(text, speed) {
  const [displayedText, setDisplayedText] = useState(""); // Initially empty

  useEffect(() => {
    let index = 0;
    let currentText = ""; // Keep track of the text being typed locally to avoid relying on React's async state
    const interval = setInterval(() => {
      currentText += text.charAt(index); // Append the next character
      setDisplayedText(currentText); // Update the state with the full string up to the current character
      index += 1;

      // Stop once the entire text is typed
      if (index === text.length) {
        clearInterval(interval);
      }
    }, speed);

    // Clean up the interval when the component unmounts or text changes
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayedText;
}

function BotBubble({ text, isDrug, data }) {
  if (isDrug)
    return (
      <div style={{ alignSelf: "flex-end" }}>
        <MoleculeRenderer data={data} duration={50} />
      </div>
    );

  const typedText = useTypewriterEffect(text, 50);
  return <div className="bot-bubble">{typedText}</div>;
}

export default BotBubble;

import React, { useState, useEffect } from "react";
import MoleculeRenderer from "./MoleculeRenderer";
import ReactMarkdown from "react-markdown"; // Import the library

// Function to simulate the typewriter effect
function useTypewriterEffect(text, speed) {
  const [displayedText, setDisplayedText] = useState(""); // Initially empty

  useEffect(() => {
    let index = 0;
    let currentText = "";
    const interval = setInterval(() => {
      currentText += text.charAt(index);
      setDisplayedText(currentText);
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
  if (isDrug) {
    return (
      <div style={{ alignSelf: "flex-end" }}>
        <MoleculeRenderer data={data} duration={12} />
      </div>
    );
  }

  // Use the typewriter effect for text
  const typedText = useTypewriterEffect(text, 50);

  // Render Markdown safely
  return (
    <div className="bot-bubble">
      <ReactMarkdown>{typedText}</ReactMarkdown>
    </div>
  );
}

export default BotBubble;

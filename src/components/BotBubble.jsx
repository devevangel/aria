import React, { useState, useEffect } from "react";
import MoleculeRenderer from "./MoleculeRenderer";
import ReactMarkdown from "react-markdown"; // Import the library

// Function to simulate the typewriter effect
function useTypewriterEffect(text, speed, setIsTyping, setIsIdle) {
  const [displayedText, setDisplayedText] = useState(""); // Initially empty

  useEffect(() => {
    let index = 0;
    let currentText = "";

    // Set isTyping to true when typing starts
    setIsTyping(true);
    setIsIdle(false);

    const interval = setInterval(() => {
      currentText += text.charAt(index);
      setDisplayedText(currentText);
      index += 1;

      // Stop once the entire text is typed
      if (index === text.length) {
        clearInterval(interval);

        // Set isTyping to false and isIdle to true once typing finishes
        setIsTyping(false);
        setIsIdle(true);
      }
    }, speed);

    // Clean up the interval when the component unmounts or text changes
    return () => clearInterval(interval);
  }, [text, speed, setIsTyping, setIsIdle]);

  return displayedText;
}

function BotBubble({ text, isDrug, data, isMixed, drug, index, lastIndex }) {
  const [isTyping, setIsTyping] = useState(true); // Typing state
  const [isIdle, setIsIdle] = useState(true); // Idle state

  // Handle molecule rendering or mixed content
  if (isDrug) {
    return (
      <div style={{ alignSelf: "flex-end" }}>
        <MoleculeRenderer data={data} duration={12} />
      </div>
    );
  } else if (isMixed) {
    const typedText = useTypewriterEffect(text, 60, setIsTyping, setIsIdle);

    return (
      <div className="bot-bubble">
        <div style={{ alignSelf: "flex-end" }}>
          {index === lastIndex ? (
            <ReactMarkdown>{typedText}</ReactMarkdown>
          ) : (
            <ReactMarkdown>{text}</ReactMarkdown>
          )}
          {isIdle && !isTyping && lastIndex === index && (
            <MoleculeRenderer data={drug} duration={30} />
          )}
          {lastIndex !== index && <MoleculeRenderer data={drug} duration={1} />}
        </div>
      </div>
    );
  } else if (!isMixed && !isDrug) {
    const typedText = useTypewriterEffect(text, 60, setIsTyping, setIsIdle);

    // Render Markdown safely
    return (
      <div className="bot-bubble">
        {index === lastIndex ? (
          <ReactMarkdown>{typedText}</ReactMarkdown>
        ) : (
          <ReactMarkdown>{text}</ReactMarkdown>
        )}
      </div>
    );
  }
}

export default BotBubble;

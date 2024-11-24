import React, { useState } from "react";
import ChatContainer from "./components/ChatContainer";
import ChatInputBox from "./components/ChatInputBox";
import conversationList from "./assets/conversations.json";

function processUserPrompt(promptText) {
  const cleanedText = promptText
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .toLowerCase();

  return cleanedText.split(/\s+/); // Split by spaces
}

function findBestMatch(userPrompt, jsonList) {
  // Get user words from the prompt
  const userWords = processUserPrompt(userPrompt);

  // Variable to track the best match
  let bestMatch = null;
  let maxMatchCount = 0;

  // Loop through each conversation object in the JSON
  for (let i = 0; i < jsonList.length; i++) {
    const conversation = jsonList[i];
    const keywords = conversation.keywords.map((keyword) =>
      keyword.toLowerCase()
    );

    // Count how many user words match the conversation's keywords
    const matchCount = userWords.filter((word) =>
      keywords.includes(word)
    ).length;

    // If the current match is better than the previous best match, update bestMatch
    if (matchCount > maxMatchCount) {
      maxMatchCount = matchCount;
      bestMatch = conversation;
    }
  }

  // If a match is found, return a random response from that conversation's responses array
  if (bestMatch) {
    if (bestMatch.isDrug) {
      return {
        isObject: true,
        data: bestMatch.responses[0],
      };
    } else {
      const randomIndex = Math.floor(
        Math.random() * bestMatch.responses.length
      );
      return bestMatch.responses[randomIndex];
    }
  } else {
    return "I'm not sure what you're saying, but I'm here to help!";
  }
}

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  function handleSend(e) {
    if (userInput.length <= 0) return;
    e.preventDefault();
    const response = findBestMatch(userInput, conversationList);

    if (response.isObject) {
      setChatHistory([
        ...chatHistory,
        { type: "user", text: userInput },
        { type: "bot", isDrug: true, data: response.data },
      ]);
    } else {
      setChatHistory([
        ...chatHistory,
        { type: "user", text: userInput },
        { type: "bot", text: response },
      ]);
    }

    setUserInput("");
  }

  return (
    <section className="app">
      <h1 style={{ textDecoration: "underline" }}>ARIA Lilly's R&D AI Tool</h1>
      <ChatContainer history={chatHistory} lastIndex={chatHistory.length - 1} />
      <ChatInputBox
        input={userInput}
        setInput={setUserInput}
        send={handleSend}
      />
    </section>
  );
};

export default App;

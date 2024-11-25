import React, { useState } from "react";
import ChatContainer from "./components/ChatContainer";
import ChatInputBox from "./components/ChatInputBox";
import conversationList from "./assets/conversations.json";
import Logo from "./assets/logo.png";

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
    } else if (bestMatch.isMixedCase) {
      const randomIndex = Math.floor(
        Math.random() * bestMatch.responses.length
      );
      return {
        isMixed: true,
        drug: bestMatch.drug,
        data: bestMatch.responses[randomIndex],
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
    } else if (response.isMixed) {
      setChatHistory([
        ...chatHistory,
        { type: "user", text: userInput },
        {
          type: "bot",
          isMixed: true,
          drug: response.drug,
          text: response.data,
        },
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
      <div style={{ textAlign: "center" }}>
        <img src={Logo} alt="logo" style={{ width: "130px", height: "50px" }} />
        <p className="title-text">
          Project ARIA (Advanced Research and Innovation Assistant)
        </p>
      </div>
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

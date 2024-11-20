import React, { useState } from "react";
import ChatContainer from "./components/ChatContainer";
import MoleculeRenderer from "./components/MoleculeRenderer";
import ChatInputBox from "./components/ChatInputBox";
import conversationList from "./assets/conversations.json";

const moleculeData = {
  PC_Compounds: [
    {
      id: {
        id: {
          cid: 1983,
        },
      },
      atoms: {
        aid: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        ],
        element: [8, 8, 7, 6, 6, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      },
      bonds: {
        aid1: [1, 1, 2, 3, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 10, 11, 11, 11],
        aid2: [
          9, 20, 10, 4, 10, 14, 5, 6, 7, 12, 8, 13, 9, 15, 9, 16, 11, 17, 18,
          19,
        ],
        order: [1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1],
      },
      coords: [
        {
          type: [1, 5, 255],
          aid: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20,
          ],
          conformers: [
            {
              x: [
                2.866, 4.5981, 2.866, 2.866, 2, 3.732, 2, 3.732, 2.866, 3.732,
                3.732, 1.4631, 4.269, 2.3291, 1.4631, 4.269, 4.352, 3.732,
                3.112, 2.3291,
              ],
              y: [
                -2.595, 1.405, 1.405, 0.405, -0.095, -0.095, -1.095, -1.095,
                -1.595, 1.905, 2.905, 0.215, 0.215, 1.715, -1.405, -1.405,
                2.905, 3.525, 2.905, -2.905,
              ],
              style: {
                annotation: [8, 8, 8, 8, 8, 8],
                aid1: [4, 4, 5, 6, 7, 8],
                aid2: [5, 6, 7, 8, 9, 9],
              },
            },
          ],
        },
      ],
      charge: 0,
    },
  ],
};

function processUserPrompt(promptText) {
  // Make all letters lowercase, remove special characters, and excess spaces
  const cleanedText = promptText
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
    .trim() // Trim spaces from both ends
    .toLowerCase(); // Convert all letters to lowercase

  // Split the cleaned text into words
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
    ); // Normalize keywords

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

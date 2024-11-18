import React from "react";

import UserBubble from "./UserBubble.jsx";
import BotBubble from "./BotBubble.jsx";

function ChatContainer({ history }) {
  return (
    <section className="chat-container">
      {history.map((message, index) => {
        if (message.type === "user") {
          return <UserBubble key={index} text={message.text} />;
        } else {
          return <BotBubble key={index} text={message.text} />;
        }
      })}
    </section>
  );
}

export default ChatContainer;

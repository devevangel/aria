import React from "react";

import UserBubble from "./UserBubble.jsx";
import BotBubble from "./BotBubble.jsx";

function ChatContainer({ history, lastIndex }) {
  return (
    <section className="chat-container">
      {history.map((message, index) => {
        if (message.type === "user") {
          return <UserBubble key={index} text={message.text} />;
        } else {
          return (
            <BotBubble
              key={index}
              text={message?.text}
              index={index}
              lastIndex={lastIndex}
              isDrug={message?.isDrug}
              data={message?.data}
            />
          );
        }
      })}
    </section>
  );
}

export default ChatContainer;

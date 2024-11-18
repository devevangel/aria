import React from "react";

function ChatInputBox({ input, setInput, send }) {
  return (
    <form className="user-input-box" onSubmit={send}>
      <input
        className="input-text-area"
        type="text"
        value={input}
        placeholder="Type a message..."
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="send-button" type="submit" onClick={send}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="3em"
          height="3em"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M3 20v-6l8-2l-8-2V4l19 8z" />
        </svg>
      </button>
    </form>
  );
}

export default ChatInputBox;

import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import useReactToMessage from "../../hooks/useReactToMessage";

const EMOJIS = ["❤️", "😂", "😮", "😢", "👍"];

const Message = ({ message }) => {
  const [showPicker, setShowPicker] = useState(false);
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const { loading, reactToMessage } = useReactToMessage();

  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassname = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;

  const bgColor = fromMe ? "bg-blue-500" : "";
  const shakeClass = message.shouldShake ? "shake" : "";

  return (
    <div className={`chat ${chatClassname}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={profilePic} alt="MessComp" />
        </div>
      </div>

      {/* Wrapper */}
      <div className="relative group">
        {/* Bubble */}
        <div className={`chat-bubble text-white ${bgColor} ${shakeClass}`}>
          {message.message}
        </div>

        {/* ➕ Button */}
        <button
          onClick={() => setShowPicker((p) => !p)}
          className={`absolute top-1/2 -translate-y-1/2
            ${fromMe ? "-left-6" : "-right-6"}
            opacity-0 group-hover:opacity-100
            transition bg-base-300 rounded-full p-1 text-sm`}
        >
          ➕
        </button>

        {/* Emoji Picker */}
        {showPicker && (
          <div
            className={`absolute z-20 flex gap-1 p-1 bg-base-200 rounded-lg shadow
              ${fromMe ? "-left-12" : "left-0"} top-8`}
          >
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                className="hover:scale-110 transition"
                onClick={() => {
                  reactToMessage(message._id, emoji);
                  setShowPicker(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div
            className={`absolute -bottom-3
              ${fromMe ? "right-4" : "left-4"}
              bg-base-200 px-2 py-0.5 rounded-full
              flex gap-1 text-sm shadow `}
          >
            {message.reactions.map((r) => (
              <span key={r._id}>
                {r.emoji}
                {r.users.length > 1 && r.users.length}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="chat-footer opacity-50 text-xs">{formattedTime}</div>
    </div>
  );
};

export default Message;

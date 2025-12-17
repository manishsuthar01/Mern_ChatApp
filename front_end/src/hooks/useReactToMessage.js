import { useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";

const useReactToMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages } = useConversation();

  const reactToMessage = async (messageId, emoji) => {
    if (!emoji) return;

    try {
      setLoading(true);

      const res = await fetch(
        `/api/messages/${messageId}/reaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emoji }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to react");
      }

      const updatedReactions = await res.json();

      // update global message state
      setMessages((msgs) =>
        msgs.map((m) =>
          m._id === messageId
            ? { ...m, reactions: updatedReactions }
            : m
        )
      );
    } catch (error) {
      toast.error(error.message || "Reaction failed");
    } finally {
      setLoading(false);
    }
  };

  return { reactToMessage, loading };
};

export default useReactToMessage;

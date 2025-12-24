import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  function deriveStatus(message, authUserId) {
    // Only show ticks for messages sent by me
    if (message.senderId.toString() !== authUserId) {
      return null; // or "received"
    }

    const receiverId = message.receiverId.toString();

    if (message.readBy?.some((r) => r.userId.toString() === receiverId)) {
      return "read";
    }

    if (message.deliveredTo?.some((d) => d.userId.toString() === receiverId)) {
      return "delivered";
    }

    return "sent";
  }

  useEffect(() => {
    setMessages([]);
    const getMessages = async () => {
      if (!selectedConversation?._id) return;

      setLoading(true);

      try {
        const id = selectedConversation?._id;
        const res = await fetch(`/api/messages/${id}`);
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        const formattedMessages = data.map((msg) => ({
          ...msg,
          status: deriveStatus(msg, authUser._id),
        }));
        setMessages(formattedMessages);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, authUser._id, setMessages]);

  return { loading, messages };
};

export default useGetMessages;

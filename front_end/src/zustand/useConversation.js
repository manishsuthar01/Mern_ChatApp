import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),

  messages: [],
  setMessages: (updater) =>
    set((state) => ({
      messages:
        typeof updater === "function"
          ? updater(state.messages) // ✅ execute function
          : updater,
    })),

  updateMessageStatus: (messageId, newStatus) =>
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg._id !== messageId) return msg;

        const order = { sent: 0, delivered: 1, read: 2 };

        if (order[newStatus] <= order[msg.status]) {
          return msg; // prevent downgrade
        }

        return {
          ...msg,
          status: newStatus,
        };
      }),
    })),
}));

export default useConversation;

"use client";

import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./Main/ThemeContext";
import { MemoryPanel } from "./Main/MemoryPanel";
import { Header } from "./Main/Header";
import { MainAssistantList } from "./Main/MainAssistantList";
import ChatBox from "./Main/ChatBox"; // Import the ChatBox component
import {
  fetchAssistants,
  queryAssistant,
  fetchConversations,
  fetchConversationById,
  deleteConversationById,
} from "@/utils/apis";
import { FaTelegramPlane } from "react-icons/fa"; // Import Telegram icon
import { ImSpinner8 } from "react-icons/im"; // Import spinner icon

const MainPage = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistantId, setSelectedAssistantId] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [isMemoryPanelOpen, setIsMemoryPanelOpen] = useState(true);
  const { isDarkMode } = useTheme();

  // Fetch assistants on component mount
  useEffect(() => {
    const loadAssistants = async () => {
      try {
        const data = await fetchAssistants();
        setAssistants(data.formattedAssistants);
        if (data.formattedAssistants.length > 0) {
          setSelectedAssistantId(data.formattedAssistants[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch assistants:", err);
      }
    };

    loadAssistants();
  }, []);

  // Fetch conversations when the selected assistant changes
  useEffect(() => {
    if (selectedAssistantId) {
      const loadConversations = async () => {
        try {
          const data = await fetchConversations(selectedAssistantId);
          setConversations(data.conversations || []);
        } catch (err) {
          setConversations([]);
          console.error("Failed to fetch conversations:", err);
        }
      };

      loadConversations();
    }
  }, [selectedAssistantId]);

  // Handle query submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Submitted:", query, selectedAssistantId, selectedConversationId)
    if (!query.trim() || !selectedAssistantId) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setQuery("");

    try {
      const { reader, conversationId: convoId } = await queryAssistant({
        query,
        assistantId: selectedAssistantId,
        conversationId: selectedConversationId,
      });
      if (!selectedConversationId) {
        setSelectedConversationId(convoId);
      }

      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantMessage += chunk;

        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              { role: "assistant", content: assistantMessage },
            ];
          } else {
            return [...prev, { role: "assistant", content: assistantMessage }];
          }
        });
      }
    } catch (err) {
      console.error("Error fetching response:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to fetch response. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle starting a new conversation
  const handleNewConversation = async () => {
    try {
      setMessages([]); // Clear the chat for a new conversation
    } catch (err) {
      console.error("Failed to create new conversation:", err);
    }
  };

  // Handle selecting a conversation
  const handleSelectConversation = async (conversationId) => {
    try {
      const data = await fetchConversationById(conversationId);
      // console.table("Selected messages:", data)
      setMessages(data.conversation.messages); // Render the selected conversation's messages
      setSelectedConversationId(conversationId); // Set the selected conversation as active
    } catch (err) {
      console.error("Failed to fetch conversation:", err);
    }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <Header />
      <div className={`flex${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <MemoryPanel
          isOpen={isMemoryPanelOpen}
          onClose={() => setIsMemoryPanelOpen(false)}
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          isDarkMode={isDarkMode}
        />
        <ChatBox messages={messages} /> {/* Use the ChatBox component */}
      </div>

      {/* Bottom Section: Input Box and Assistant List */}
      <div
        className={`fixed bottom-0 left-0 right-0 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } p-6`}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
          {/* Assistant List */}
          <div className="w-full md:w-1/4">
            <MainAssistantList
              assistants={assistants}
              selectedAssistantId={selectedAssistantId}
              onSelectAssistant={setSelectedAssistantId}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Input Box */}
          <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question..."
                className={`flex-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white"
                }`}
                disabled={isLoading}
                rows={1} // Default rows, can adjust as needed
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ImSpinner8 className="animate-spin" size={20} /> // Spinner icon with animation
                ) : (
                  <FaTelegramPlane size={20} /> // Telegram icon
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Landing() {
  return (
    <ThemeProvider>
      <MainPage />
    </ThemeProvider>
  );
}

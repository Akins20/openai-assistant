import { useState } from "react";
import { FaChevronRight, FaChevronLeft, FaPlus } from "react-icons/fa";

export const MemoryPanel = ({
  isOpen,
  onClose,
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
  isDarkMode,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`fixed z-10 inset-y-0 left-0 ${
        isCollapsed ? "w-0" : "w-64"
      } transition-all duration-300 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } shadow-lg`}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={toggleCollapse}
        className={`absolute  ${
          isCollapsed ? "left-1 top-20" : "right-2 top-6"
        } text-gray-500 hover:text-gray-700 ${
          isDarkMode ? "hover:text-gray-100 text-white" : "hover:text-gray-700"
        }`}
      >
        {isCollapsed ? (
          <FaChevronRight className="h-6 w-6" />
        ) : (
          <FaChevronLeft className="h-6 w-6" />
        )}
      </button>

      {/* Panel Content (Visible when not collapsed) */}
      {!isCollapsed && (
        <div className="p-4">
          {/* Logo and Close Button */}
          <div className="flex justify-between items-center mb-4 space-y-10">
            <h2 className="font-bold text-xl">Next AI Assistant</h2>
            <button
              onClick={onClose}
              className={`text-gray-500 ${
                isDarkMode ? "hover:text-gray-300" : "hover:text-gray-700"
              }`}
            >
              {/* Close button (optional) */}
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={onNewConversation}
            className={`w-full mb-4 p-2 ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white rounded-lg flex items-center justify-center`}
          >
            <FaPlus className="mr-2" /> New Chat
          </button>

          {/* Chat History */}
          <h3 className="font-bold mb-4">Chat History</h3>
          <div className="space-y-2">
            {conversations.map((conversation, index) => (
              <div
                key={conversation._id}
                onClick={() => onSelectConversation(conversation._id)}
                className={`p-2 rounded cursor-pointer ${
                  selectedConversationId === conversation._id
                    ? isDarkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : isDarkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`}
              >
                Conversation {index + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Collapse/Expand Button (Only visible when collapsed on mobile) */}
      {/* {isCollapsed && (
        <button
          onClick={toggleCollapse}
          className={`md:hidden absolute top- left-2 text-gray-500 ${
            isDarkMode ? "hover:text-gray-300" : "hover:text-gray-700"
          }`}
        >
          <FaChevronRight className="h-6 w-6" />
        </button>
      )} */}
    </div>
  );
};

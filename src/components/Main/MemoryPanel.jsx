import { useState } from "react";
import { FaChevronRight, FaChevronLeft, FaPlus } from "react-icons/fa";

export const MemoryPanel = ({
  isOpen,
  onClose,
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`fixed z-10 inset-y-0 left-0 ${
        isCollapsed ? "w-12" : "w-64"
      } bg-white shadow-lg transition-all duration-300`}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={toggleCollapse}
        className={`absolute top-4 ${
          isCollapsed ? "left-2" : "right-2"
        } text-gray-500 hover:text-gray-700`}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl">Next AI Assistant</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              {/* Close button (optional) */}
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={onNewConversation}
            className="w-full mb-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
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
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Conversation {index + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ChatMessage = ({ role, content }) => {
  return (
    <div
      className={`flex ${
        role === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          role === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white"
        }`}
      >
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;

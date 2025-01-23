import ChatMessage from "./ChatMessage";

const ChatBox = ({ messages }) => {
  console.table(messages);
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto">
        {messages?.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} content={msg.content} />
        ))}
      </div>
    </div>
  );
};

export default ChatBox;

import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  assistantId: {
    type: String,
    required: true,
  },
  messages: [
    {
      role: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;

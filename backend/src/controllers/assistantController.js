import OpenAI from "openai";
import Document from "../models/Document.js";
import Conversation from "../models/Conversation.js";
import fs from "fs";
import path from "path";

const openai = new OpenAI();

// 1. Create Assistant
export const createAssistant = async (req, res) => {
  try {
    const { name, model, instructions } = req.body;

    // Create OpenAI Assistant
    const assistant = await openai.beta.assistants.create({
      name,
      model: model || "gpt-3.5-turbo",
      instructions:
        instructions ||
        "You are a helpful assistant that answers questions based on provided documents.",
      tools: [], // Initially, no tools added
    });

    res
      .status(201)
      .json({ message: "Assistant created successfully", assistant });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create assistant",
      error: err.message,
    });
  }
};

// 2. View Assistants
export const viewAllAssistants = async (req, res) => {
  try {
    const assistants = await openai.beta.assistants.list();

    if (!assistants.data || assistants.data.length === 0) {
      return res
        .status(200)
        .json({ message: "No assistants found", assistants: [] });
    }

    const formattedAssistants = assistants.data.map((assistant) => ({
      id: assistant.id,
      name: assistant.name,
      model: assistant.model,
      instructions: assistant.instructions,
      tools: assistant.tools,
      created_at: assistant.created_at,
      updated_at: assistant.updated_at,
    }));

    res.status(200).json({
      message: "Assistants fetched successfully",
      formattedAssistants,
    });
  } catch (err) {
    console.error("Error fetching assistants:", err);
    res.status(500).json({
      message: "Failed to fetch assistants",
      error: err.message,
    });
  }
};

// 3. Update Assistant
export const updateAssistant = async (req, res) => {
  try {
    const { assistantId, updates } = req.body;

    // Apply updates to the assistant
    const updatedAssistant = await openai.beta.assistants.update(
      assistantId,
      updates
    );

    res.status(200).json({
      message: "Assistant updated successfully",
      updatedAssistant,
    });
  } catch (err) {
    console.error("Error updating assistant:", err);
    res.status(500).json({
      message: "Failed to update assistant",
      error: err.message,
    });
  }
};

// 4. Upload Files to Assistant
export const uploadFilesToAssistant = async (req, res) => {
  try {
    const { assistantId, documentIds } = req.body;

    // Fetch documents
    const documents = await Document.find({ _id: { $in: documentIds } });

    // Prepare file streams
    const files = documents.map((doc) => {
      const filepath = path.normalize(doc.filepath);

      if (!fs.existsSync(filepath)) {
        throw new Error(`File not found: ${filepath}`);
      }
      return fs.createReadStream(filepath);
    });

    // Create a vector store
    const vectorStore = await openai.beta.vectorStores.create({
      name: `VectorStore-${assistantId}`,
    });

    console.log("Upoading files to vector store...");
    // Upload files to the vector store
    await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {
      files: files, // Pass the files array inside an object
    });
    console.log("File uploaded succesfully");

    // Link vector store to assistant
    const updatedAssistant = await openai.beta.assistants.update(assistantId, {
      tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
    });

    console.log("Open ai assistant updated successfully...");

    res.status(200).json({
      message: "Files uploaded and assistant updated successfully",
      updatedAssistant,
    });
  } catch (err) {
    console.error("Error uploading files to assistant:", err);
    res.status(500).json({
      message: "Failed to upload files to assistant",
      error: err.message,
    });
  }
};

// 5. Delete Assistant
export const deleteAssistant = async (req, res) => {
  try {
    const { assistantId } = req.params;

    await openai.beta.assistants.delete(assistantId);

    res.status(200).json({ message: "Assistant deleted successfully" });
  } catch (err) {
    console.error("Error deleting assistant:", err);
    res.status(500).json({
      message: "Failed to delete assistant",
      error: err.message,
    });
  }
};

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { assistantId } = req.body;

    // Create a new conversation in the database
    const newConversation = new Conversation({
      assistantId,
      messages: [], // Start with an empty array of messages
    });

    await newConversation.save();

    res.status(201).json({
      message: "Conversation created successfully",
      conversation: newConversation,
    });
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({
      message: "Failed to create conversation",
      error: err.message,
    });
  }
};

// 6. Query Assistant
export const queryAssistant = async (req, res) => {
  try {
    const { query, assistantId, conversationId } = req.body;
    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    // Fetch the assistant to get its configuration
    const assistant = await openai.beta.assistants.retrieve(assistantId);

    // Stream the response from the selected assistant
    const stream = await openai.beta.chat.completions.stream({
      model: assistant.model, // Use the assistant's model
      messages: [{ role: "user", content: query }],
      stream: true,
    });

    let assistantResponse = "";

    // Stream the response to the client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      assistantResponse += content;
      res.write(content);
    }

    res.end();

    let conversation;

    // If conversationId is not provided, create a new conversation
    if (!conversationId) {
      conversation = new Conversation({
        assistantId,
        messages: [], // Start with an empty array of messages
      });
    } else {
      // Fetch the existing conversation
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }
    }

    // Add the new messages to the conversation
    conversation.messages.push(
      { role: "user", content: query },
      { role: "assistant", content: assistantResponse }
    );

    await conversation.save();

    // If a new conversation was created, return its ID to the client
    if (!conversationId) {
      res.status(201).json({
        message: "Conversation created and updated successfully",
        conversationId: conversation._id,
      });
    }
  } catch (err) {
    console.error("Error querying assistant:", err);
    res
      .status(500)
      .json({ message: "Failed to query assistant", error: err.message });
  }
};

// 7. Get All Conversations for an Assistant
export const getAllConversations = async (req, res) => {
  try {
    const { assistantId } = req.params;

    const conversations = await Conversation.find({ assistantId });

    res.status(200).json({
      message: "Conversations fetched successfully",
      conversations,
    });
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({
      message: "Failed to fetch conversations",
      error: err.message,
    });
  }
};

// 8. Get Conversation by ID
export const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json({
      message: "Conversation fetched successfully",
      conversation,
    });
  } catch (err) {
    console.error("Error fetching conversation:", err);
    res.status(500).json({
      message: "Failed to fetch conversation",
      error: err.message,
    });
  }
};

// 9. Delete Conversation by ID
export const deleteConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const deletedConversation = await Conversation.findByIdAndDelete(
      conversationId
    );

    if (!deletedConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json({
      message: "Conversation deleted successfully",
      deletedConversation,
    });
  } catch (err) {
    console.error("Error deleting conversation:", err);
    res.status(500).json({
      message: "Failed to delete conversation",
      error: err.message,
    });
  }
};

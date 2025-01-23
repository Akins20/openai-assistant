import express from "express";
import {
  createAssistant,
  viewAllAssistants,
  updateAssistant,
  uploadFilesToAssistant,
  deleteAssistant,
  queryAssistant,
  getAllConversations,
  getConversationById,
  deleteConversationById,
  createConversation,
} from "../controllers/assistantController.js";

const router = express.Router();

// Create assistant route
router.post("/create", createAssistant);

// Query assistant route
router.post("/query", queryAssistant);

// View all assistants route
router.get("/all", viewAllAssistants);

// Update assistant route
router.put("/update/:assistantId", updateAssistant);

// Upload files to assistant route
router.post("/upload/:assistantId", uploadFilesToAssistant);

// Delete assistant route
router.delete("/delete/:assistantId", deleteAssistant);

// Get all conversations for an assistant
router.get("/conversations/:assistantId", getAllConversations)

// Get conversation by Id
router.get("/conversations/id/:conversationId", getConversationById)

// Delete conversation by Id
router.delete("/conversations/:conversationId", deleteConversationById)

router.post("/create-conversation", createConversation); // Add the new route



export default router;

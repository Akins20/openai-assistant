import express from "express";
import { uploadDocument, fetchAllDocuments } from "../controllers/documentController.js";

const router = express.Router();

// Fetch all documents route
router.get("/all", fetchAllDocuments);
// Upload document route
router.post("/upload", uploadDocument);



export default router;
import multer from "multer";
import pdfParse from "pdf-parse-new"; // For text extraction
import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Document from "../models/Document.js";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "uploads");
const savedDir = path.join(uploadDir, "saved");

// Create necessary directories if they don't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(savedDir)) {
  fs.mkdirSync(savedDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single("file");

export const uploadDocument = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "File upload failed", error: err });
      }

      const { file } = req;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      let text = "";

      // Extract text based on file type
      if (file.mimetype === "application/pdf") {
        try {
          // Extract text from PDF using pdf-parse
          const dataBuffer = fs.readFileSync(file.path);
          const data = await pdfParse(dataBuffer);
          text = data.text;
        } catch (pdfErr) {
          console.error("Error extracting text from PDF:", pdfErr);
          return res.status(500).json({
            message: "Failed to extract text from PDF",
            error: pdfErr.message,
          });
        }
      } else if (file.mimetype === "text/plain") {
        // Extract text from plain text files
        text = fs.readFileSync(file.path, "utf8");
      } else if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Extract text from .docx files
        const result = await mammoth.extractRawText({ path: file.path });
        text = result.value;
      } else {
        return res.status(400).json({ message: "Unsupported file type" });
      }

      // Save document to the database
      const document = new Document({
        filename: file.originalname,
        filepath: path.join(savedDir, file.filename), // Update the filepath to reflect the new saved location
        content: text,
      });
      await document.save();

      // Move the file to the permanent storage location
      const newFilePath = path.join(savedDir, file.filename);
      fs.renameSync(file.path, newFilePath); // Move the file

      res.status(201).json({
        message: "File uploaded and stored successfully",
        document,
      });
    });
  } catch (err) {
    res.status(500).json({ message: "File upload failed", error: err.message });
  }
};

// Fetch all documents function
export const fetchAllDocuments = async (req, res) => {
  try {
    // Fetch all documents from the database
    const documents = await Document.find({});
    res.status(200).json(documents);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch documents", error: err.message });
  }
};

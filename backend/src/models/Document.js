import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  content: { type: String, required: true },
});

export default mongoose.model("Document", documentSchema);

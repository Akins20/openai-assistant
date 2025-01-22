"use client"
import { useState } from "react";

export default function FileUploadForm({ onFileUpload }) {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file.");
      return;
    }
    onFileUpload(file);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 p-2 border rounded-lg w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 w-full"
      >
        Upload Document
      </button>
    </form>
  );
}

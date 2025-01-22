import { useState } from "react";
import DocumentSelection from "./DocumentSelection";

export default function UpdateAssistantForm({
  assistants,
  onUpdateAssistant,
  onUploadFiles,
  documents,
}) {
  const [selectedAssistantId, setSelectedAssistantId] = useState("");
  const [updates, setUpdates] = useState({
    name: "",
    model: "",
    instructions: "",
  });
  const [documentIds, setDocumentIds] = useState([]);
  const [uploadMode, setUploadMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!selectedAssistantId) {
      alert("Please select an assistant to update.");
      return;
    }

    const filteredUpdates = Object.entries(updates).reduce(
      (acc, [key, value]) => {
        if (value.trim()) acc[key] = value;
        return acc;
      },
      {}
    );

    onUpdateAssistant(selectedAssistantId, filteredUpdates);
    setUpdates({ name: "", model: "", instructions: "" }); // Reset fields
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);

    if (!selectedAssistantId) {
      alert("Please select an assistant to upload files to.");
      return;
    }

    if (!documentIds) {
      alert("Please select at least one document.");
      return;
    }

    onUploadFiles(selectedAssistantId, documentIds);
    setIsUploading(false); // Reset upload status
    setDocumentIds(""); // Reset document selection
  };

  return (
    <div className="bg-gray-200 p-4 my-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Update Assistant</h2>

      <form onSubmit={uploadMode ? handleFileUpload : handleUpdate}>
        {/* Assistant Selection */}
        <div className="mb-4">
          <label
            htmlFor="assistant"
            className="block font-medium text-gray-700 mb-1"
          >
            Select Assistant
          </label>
          <select
            id="assistant"
            value={selectedAssistantId}
            onChange={(e) => setSelectedAssistantId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select an Assistant --</option>
            {assistants?.map((assistant) => (
              <option key={assistant.id} value={assistant.id}>
                {assistant.name} (ID: {assistant.id})
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center mb-4">
          <label className="mr-2 text-gray-700 font-medium">Mode:</label>
          <button
            type="button"
            onClick={() => setUploadMode(false)}
            className={`p-2 rounded-l ${
              !uploadMode ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            Update Details
          </button>
          <button
            type="button"
            onClick={() => setUploadMode(true)}
            className={`p-2 rounded-r ${
              uploadMode ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            Upload Files
          </button>
        </div>

        {uploadMode ? (
          // Upload Mode
          <>
            <DocumentSelection
              documents={documents}
              onSelectDocument={setDocumentIds}
            />
            <button
              type="submit"
              disabled={isUploading}
              className="bg-blue-500 text-black px-2 py-2 rounded my-10"
            >
              {isUploading ? "uploading" : "Update Assistant"}
            </button>
          </>
        ) : (
          // Update Details Mode
          <>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block font-medium text-gray-700 mb-1"
              >
                Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                value={updates.name}
                onChange={(e) =>
                  setUpdates({ ...updates, name: e.target.value })
                }
                placeholder="Enter new name"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="model"
                className="block font-medium text-gray-700 mb-1"
              >
                Model (Optional)
              </label>
              <input
                type="text"
                id="model"
                value={updates.model}
                onChange={(e) =>
                  setUpdates({ ...updates, model: e.target.value })
                }
                placeholder="e.g., gpt-3.5-turbo"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="instructions"
                className="block font-medium text-gray-700 mb-1"
              >
                Instructions (Optional)
              </label>
              <textarea
                id="instructions"
                value={updates.instructions}
                onChange={(e) =>
                  setUpdates({ ...updates, instructions: e.target.value })
                }
                placeholder="Enter new instructions"
                className="w-full p-2 border rounded"
                rows={4}
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update Assistant
            </button>
          </>
        )}
      </form>
    </div>
  );
}

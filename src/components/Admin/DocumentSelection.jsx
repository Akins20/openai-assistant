"use client";

import { useState } from "react";

export default function DocumentSelection({ documents, onSelectDocument }) {
  const [selectedDocumentIds, setSelectedDocumentIds] = useState([]);

  // Handle checkbox change
  const handleCheckboxChange = (documentId) => {
    const updatedSelectedIds = selectedDocumentIds.includes(documentId)
      ? selectedDocumentIds.filter((id) => id !== documentId) // Uncheck
      : [...selectedDocumentIds, documentId]; // Check

    setSelectedDocumentIds(updatedSelectedIds);
    onSelectDocument(updatedSelectedIds); // Pass selected IDs to parent
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Select Documents</h3>
      {documents.length === 0 ? (
        <p className="text-gray-500">No documents available.</p>
      ) : (
        documents.map((doc) => (
          <div key={doc._id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={doc._id}
              checked={selectedDocumentIds.includes(doc._id)}
              onChange={() => handleCheckboxChange(doc._id)}
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
            />
            <label htmlFor={doc._id} className="text-gray-700">
              {doc.filename} (ID: {doc._id})
            </label>
          </div>
        ))
      )}
    </div>
  );
}

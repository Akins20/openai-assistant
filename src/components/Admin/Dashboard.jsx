"use client";

import { useState, useEffect } from "react";
import Tabs from "./Tabs";
import DocumentList from "./DocumentList";
import AssistantList from "./AssistantList";
import FileUploadForm from "./FileUploadForm";
import CreateAssistantForm from "./CreateAssistantForm";
import UpdateAssistantForm from "./UpdateAssistantForm";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("documents");
  const [documents, setDocuments] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [error, setError] = useState(null);

  // Fetch documents and assistants on component mount
  useEffect(() => {
    fetchDocuments();
    fetchAssistants();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/documents/all");
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      setError("Failed to fetch documents.");
      console.error(err);
    }
  };

  const fetchAssistants = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/assistants/all");
      const data = await res.json();
      if (res.ok) {
        setAssistants(data.formattedAssistants || []);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch assistants.");
      console.error(err);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5000/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("File uploaded successfully!");
        fetchDocuments();
      } else {
        alert("File upload failed: " + data.message);
      }
    } catch (err) {
      setError("File upload failed.");
      console.error(err);
    }
  };

  const handleDeleteDocument = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/documents/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("Document deleted successfully!");
        fetchDocuments();
      } else {
        alert("Failed to delete document.");
      }
    } catch (err) {
      setError("Error deleting document.");
      console.error(err);
    }
  };

  const handleCreateAssistant = async ({ name, model, instructions }) => {
    try {
      const res = await fetch("http://localhost:5000/api/assistants/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, model, instructions }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Assistant created successfully!");
        fetchAssistants();
      } else {
        alert("Assistant creation failed: " + data.message);
      }
    } catch (err) {
      setError("Error creating assistant.");
      console.error(err);
    }
  };

  const handleUpdateAssistant = async (assistantId, updates) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/assistants/update/${assistantId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Assistant updated successfully!");
        fetchAssistants();
      } else {
        alert("Assistant update failed: " + data.message);
      }
    } catch (err) {
      setError("Error updating assistant.");
      console.error(err);
    }
  };
  const handleUploadFilesToAssistant = async (assistantId, documentIds) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/assistants/upload/${assistantId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assistantId, documentIds }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Files uploaded successfully!");
        fetchAssistants();
      } else {
        alert("File upload failed: " + data.message);
      }
    } catch (err) {
      setError("Error uploading files.");
      console.error(err);
    }
  };

  const handleDeleteAssistant = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/assistants/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Assistant deleted successfully!");
        fetchAssistants();
      } else {
        alert("Failed to delete assistant.");
      }
    } catch (err) {
      setError("Error deleting assistant.");
      console.error(err);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 mb-4 rounded">{error}</div>
        )}

        {/* Tabs */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {activeTab === "documents" && (
            <>
              <FileUploadForm onFileUpload={handleFileUpload} />
              <DocumentList
                documents={documents}
                onDeleteDocument={handleDeleteDocument}
              />
            </>
          )}

          {activeTab === "assistants" && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column: Create Assistant */}
              <div className="flex-1">
                <CreateAssistantForm
                  onCreateAssistant={handleCreateAssistant}
                  documents={documents}
                />
              </div>

              {/* Right Column: Update Assistant */}
              {assistants.length > 0 && (
                <div className="flex-1">
                  <UpdateAssistantForm
                    assistants={assistants}
                    onUploadFiles={handleUploadFilesToAssistant}
                    onUpdateAssistant={handleUpdateAssistant}
                    documents={documents}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

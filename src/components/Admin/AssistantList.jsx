import { useState } from "react";

export default function AssistantList({ assistants, onDeleteAssistant }) {
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  console.log("These are assistants: ", JSON.stringify(assistants));

  const handleAssistantClick = (assistant) => {
    setSelectedAssistant(assistant); // Set the selected assistant to show in the modal
  };

  const closeModal = () => {
    setSelectedAssistant(null); // Close the modal by clearing the selected assistant
  };

  return (
    <div className="my-6 bg-gray-200 p-4">
      <h2 className="text-xl font-semibold mb-4">Assistants</h2>
      <ul>
        {assistants?.map((assistant) => (
          <li
            key={assistant.id}
            className="mb-2 flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition duration-200"
            onClick={() => handleAssistantClick(assistant)}
          >
            <span className="text-gray-700">
              {assistant.name} (ID: {assistant.id})
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal from opening when delete button is clicked
                onDeleteAssistant(assistant.id);
              }}
              className="text-red-500 hover:text-red-700 transition duration-200"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {selectedAssistant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Assistant Details
            </h3>
            <div className="mb-4">
              <p className="text-gray-700">
                <strong>Name:</strong> {selectedAssistant.name}
              </p>
              <p className="text-gray-700">
                <strong>ID:</strong> {selectedAssistant.id}
              </p>
              <p className="text-gray-700">
                <strong>Model:</strong> {selectedAssistant.model}
              </p>
              <p className="text-gray-700">
                <strong>Instructions:</strong> {selectedAssistant.instructions}
              </p>
              <p className="text-gray-700">
                <strong>Tools:</strong>{" "}
                {selectedAssistant.tools.map((tool) => tool.type).join(", ") ||
                  "None"}
              </p>
              <p className="text-gray-700">
                <strong>Created At:</strong>{" "}
                {new Date(selectedAssistant.created_at).toLocaleString()}
              </p>
              <p className="text-gray-700">
                <strong>Updated At:</strong>{" "}
                {new Date(selectedAssistant.updated_at).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa"; // Import icons from react-icons

export const MainAssistantList = ({
  assistants,
  selectedAssistantId,
  onSelectAssistant,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Find the selected assistant
  const selectedAssistant = assistants.find(
    (assistant) => assistant.id === selectedAssistantId
  );

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`w-full px-4 py-2 text-left rounded-lg border ${
          isDropdownOpen ? "border-blue-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center`}
      >
        {selectedAssistant ? (
          <div>
            <h3 className="font-bold text-gray-600">
              {selectedAssistant.name}
            </h3>
            <p className="text-sm text-gray-600">
              {selectedAssistant.instruction}
            </p>
          </div>
        ) : (
          "Select an Assistant"
        )}
        {/* Toggle Icon */}
        {isDropdownOpen ? (
          <FaChevronDown className="h-5 w-5 text-gray-600" /> // Up arrow when dropdown is open
        ) : (
          <FaChevronUp className="h-5 w-5 text-gray-600" /> // Down arrow when dropdown is closed
        )}
      </button>

      {/* Dropup List */}
      {isDropdownOpen && (
        <div className="absolute z-10 w-full bottom-full mb-2 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="space-y-2 p-2">
            {assistants
              .filter((assistant) => assistant.id !== selectedAssistantId) // Exclude the selected assistant
              .map((assistant) => (
                <div
                  key={assistant.id}
                  onClick={() => {
                    onSelectAssistant(assistant.id);
                    setIsDropdownOpen(false); // Close the dropup after selection
                  }}
                  className={`p-2 rounded cursor-pointer hover:bg-gray-100`}
                >
                  <h3 className="font-bold">{assistant.name}</h3>
                  <p className="text-sm text-gray-600">
                    {assistant.instruction}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

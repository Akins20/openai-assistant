import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export const MainAssistantList = ({
  assistants,
  selectedAssistantId,
  onSelectAssistant,
  isDarkMode,
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
          isDropdownOpen
            ? "border-blue-500"
            : isDarkMode
            ? "border-gray-600"
            : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        {selectedAssistant ? (
          <div>
            <h3
              className={`font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {selectedAssistant.name}
            </h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {selectedAssistant.instruction}
            </p>
          </div>
        ) : (
          <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            Select an Assistant
          </span>
        )}
        {/* Toggle Icon */}
        {isDropdownOpen ? (
          <FaChevronDown
            className={`h-5 w-5 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          />
        ) : (
          <FaChevronUp
            className={`h-5 w-5 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          />
        )}
      </button>

      {/* Dropup List */}
      {isDropdownOpen && (
        <div
          className={`absolute z-10 w-full md:w-[300px] bottom-full mb-2 rounded-lg shadow-lg ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-300"
          }`}
        >
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
                  className={`p-2 rounded cursor-pointer ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-white"
                      : "hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  <h3 className="font-bold">{assistant.name}</h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
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

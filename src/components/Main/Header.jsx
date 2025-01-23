import { useTheme } from "./ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa"; // Import the icons

export const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`shadow-md p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1
          className={`text-3xl font-bold ${
            isDarkMode ? "text-white" : "text-blue-600"
          }`}
        >
          Next AI Assistant
        </h1>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${
            isDarkMode
              ? "text-white hover:bg-gray-700"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
        </button>
      </div>
    </div>
  );
};

import { useTheme } from "./ThemeContext";

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
          className={`px-4 py-2 rounded-lg ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
};

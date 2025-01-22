export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "documents", label: "Documents" },
    { id: "assistants", label: "Assistants" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="flex space-x-4 mb-6 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 ${
            activeTab === tab.id
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
          } transition duration-200`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

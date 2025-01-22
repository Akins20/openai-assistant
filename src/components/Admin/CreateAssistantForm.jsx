"use client";

import { useState } from "react";

export default function CreateAssistantForm({ onCreateAssistant }) {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Please fill in the assistant name.");
      return;
    }
    onCreateAssistant({ name, model, instructions });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Assistant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 p-2 border rounded-lg w-full"
        />
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="mb-4 p-2 border rounded-lg w-full"
        >
          <option value="">Select a model</option>

          <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          <option value="gpt-4">gpt-3.5-0125</option>
          <option value="gpt-3.5-turbo-0301">gpt-3.5-turbo-0301</option>
        </select>
        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="mb-4 p-2 border rounded-lg w-full h-48"
          rows={5}
          required
          maxLength={500}
          title="Limited to 500 characters"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 w-full"
        >
          Create Assistant
        </button>
      </form>
    </>
  );
}

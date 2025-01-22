const API_BASE_URL = "http://localhost:5000/api/assistants";

// Fetch all assistants
export const fetchAssistants = async () => {
  const response = await fetch(`${API_BASE_URL}/all`);
  if (!response.ok) {
    throw new Error("Failed to fetch assistants");
  }
  return response.json();
};

// Query an assistant
export const queryAssistant = async ({
  query,
  assistantId,
  conversationId,
}) => {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, assistantId, conversationId }),
  });
  if (!response.ok) {
    throw new Error("Failed to query assistant");
  }
  return response.body.getReader();
};

// Fetch all conversations for an assistant
export const fetchConversations = async (assistantId) => {
  const response = await fetch(`${API_BASE_URL}/conversations/${assistantId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }
  return response.json();
};

// Fetch a conversation by ID
export const fetchConversationById = async (conversationId) => {
  const response = await fetch(
    `${API_BASE_URL}/conversations/id/${conversationId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch conversation");
  }
  return response.json();
};

// Delete a conversation by ID
export const deleteConversationById = async (conversationId) => {
  const response = await fetch(
    `${API_BASE_URL}/conversations/${conversationId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete conversation");
  }
  return response.json();
};

// Create a new conversation
// export const createConversation = async (assistantId) => {
//   const response = await fetch(`${API_BASE_URL}/conversations`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ assistantId }),
//   });
//   if (!response.ok) {
//     throw new Error("Failed to create conversation");
//   }
//   return response.json();
// };

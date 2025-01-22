export default function DocumentList({ documents, onDeleteDocument }) {
  // console.log("These are documents: ", JSON.stringify(documents));
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Documents</h2>
      <ul>
        {documents?.map((doc) => (
          <li
            key={doc._id}
            className="mb-2 flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
          >
            <span className="text-gray-700">{doc.filename}</span>
            <button
              onClick={() => onDeleteDocument(doc._id)}
              className="text-red-500 hover:text-red-700 transition duration-200"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

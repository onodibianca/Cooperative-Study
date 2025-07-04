import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmModal";
import {
  fetchFileContent,
  fetchAnnotationsByFile,
  createAnnotation,
  deleteAnnotation,
  updateAnnotation,
  fetchAnnotationsByFileAndUser,
  fetchFileContentFriend, // ← imported from api.js
} from "../api/api";

function TextFileViewer() {
  const { fileId } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [filterUser, setFilterUser] = useState("");
  const [isFriendFile, setIsFriendFile] = useState(false);

  const debounceTimeout = useRef(null);

  useEffect(() => {
    // load file content and all annotations initially
    const loadFile = async () => {
      setLoading(true);
      try {
        const text = await fetchFileContent(fileId);
        setContent(text);
        setIsFriendFile(false); // it's the user's own file
      } catch (err) {
        if (err.message.includes("Failed to fetch file content")) {
          // Try as friend file
          try {
            const friendText = await fetchFileContentFriend(fileId);
            setContent(friendText);
            setIsFriendFile(true);
          } catch (friendErr) {
            setError("File not found or access denied.");
          }
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    const loadAnnotations = async () => {
      try {
        const data = await fetchAnnotationsByFile(fileId);
        setAnnotations(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadFile();
    loadAnnotations();
  }, [fileId]);

  useEffect(() => {
    // debounce filtering to avoid too many API calls while typing
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      if (!filterUser.trim()) {
        // If empty input, fetch all annotations
        try {
          const allAnnotations = await fetchAnnotationsByFile(fileId);
          setAnnotations(allAnnotations);
        } catch (error) {
          console.error(error);
        }
      } else {
        // fetch filtered annotations for username
        try {
          const filteredAnnotations = await fetchAnnotationsByFileAndUser(
            fileId,
            filterUser.trim()
          );
          setAnnotations(filteredAnnotations);
        } catch (error) {
          // User not found or other error, clear annotations or show message
          setAnnotations([]);
        }
      }
    }, 500); // 500ms debounce

    // Cleanup on unmount or filterUser change
    return () => clearTimeout(debounceTimeout.current);
  }, [filterUser, fileId]);

  const handleMouseUp = () => {
    const text = window.getSelection().toString();
    setSelectedText(text.trim() || "");
  };

  const submitAnnotation = async () => {
    if (!selectedText || !note) return;

    try {
      await createAnnotation({
        file_id: fileId,
        selected_text: selectedText,
        note: note,
      });

      const updated = await fetchAnnotationsByFile(fileId);
      setAnnotations(updated);

      setSelectedText("");
      setNote("");
    } catch (err) {
      console.error("Failed to save annotation:", err.message);
    }
  };

  const startEdit = (id, currentNote) => {
    setEditingId(id);
    setNote(currentNote);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNote("");
  };

  const handleUpdateAnnotation = async (id) => {
    try {
      await updateAnnotation(id, note);

      setAnnotations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, note } : a))
      );
      cancelEdit();
    } catch (err) {
      console.error("Failed to update annotation:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnnotation(id);
      setAnnotations((prev) => prev.filter((ann) => ann.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg flex gap-6">
      {/* Annotations Sidebar */}
      <div className="w-1/3 p-4 border rounded bg-gray-50 h-[80vh] overflow-y-auto sticky top-20">
        <h2 className="font-bold mb-4 text-green-700 text-xl">
          📌 Annotations
        </h2>

        <input
          type="text"
          placeholder="Filter by username..."
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        {annotations.length === 0 ? (
          <p className="italic text-gray-500">No annotations yet.</p>
        ) : (
          annotations.map((ann) => (
            <div
              key={ann.id}
              className="mb-4 p-3 border-b border-gray-200"
              title={`Annotation by ${ann.username || "Unknown"}`}
            >
              <p>
                <span className="font-semibold text-gray-600">Text:</span>{" "}
                <span className="italic text-gray-800">
                  "{ann.selected_text}"
                </span>
              </p>

              {editingId === ann.id ? (
                <>
                  <textarea
                    className="w-full p-2 border rounded mt-2"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleUpdateAnnotation(ann.id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-300 px-2 py-1 rounded"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <span className="font-semibold text-gray-600">Note:</span>{" "}
                    {ann.note}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">By:</span>{" "}
                    {ann.username || "Unknown"}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => startEdit(ann.id, ann.note)}
                      className="text-sm px-3 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(ann.id)}
                      className="text-sm px-3 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* File Viewer */}
      <div className="w-2/3 flex flex-col">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 self-start px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-extrabold mb-6 text-center text-green-700">
          📄 Text File Viewer
        </h1>

        {loading ? (
          <p className="text-center text-gray-500 italic">
            Loading file content...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        ) : (
          <>
            <div
              onMouseUp={handleMouseUp}
              className="text-gray-900 text-lg leading-relaxed whitespace-normal mb-6 overflow-auto"
              style={{
                minHeight: "400px",
                fontFamily: "ui-sans-serif, system-ui",
                paddingRight: "1rem",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
            >
              {paragraphs.map((para, i) => (
                <p key={i} className="mb-4">
                  {para}
                </p>
              ))}
            </div>

            {selectedText && (
              <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-md mb-6 sticky bottom-6 z-50 shadow-md">
                <p className="mb-2">
                  <strong>Selected Text:</strong> <em>"{selectedText}"</em>
                </p>
                <textarea
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Enter annotation note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-4">
                  <button
                    onClick={submitAnnotation}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save Annotation
                  </button>
                  <button
                    onClick={() => {
                      setSelectedText("");
                      setNote("");
                    }}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      {confirmDelete !== null && (
        <ConfirmationModal
          message="Are you sure you want to delete this annotation?"
          onConfirm={() => {
            handleDelete(confirmDelete);
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

export default TextFileViewer;

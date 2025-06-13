import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

function TextFileViewer() {
  const { fileId } = useParams();
  const [content, setContent] = useState("");
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConfirmId, setShowConfirmId] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchFileContent = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/files/${fileId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch file content");
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAnnotations = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/annotations/file/${fileId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch annotations");
        const data = await response.json();
        setAnnotations(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFileContent();
    fetchAnnotations();
  }, [fileId, token]);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection.toString();
    if (text.trim()) setSelectedText(text);
    else setSelectedText("");
  };

  const submitAnnotation = async () => {
    if (!selectedText || !note) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/annotations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          file_id: fileId,
          selected_text: selectedText,
          note,
        }),
      });

      if (!response.ok) throw new Error("Failed to save annotation");
      const result = await response.json();
      setAnnotations((prev) => [...prev, result.annotation]);
      setSelectedText("");
      setNote("");
    } catch (err) {
      console.error(err.message);
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

  const updateAnnotation = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/annotations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) throw new Error("Failed to update annotation");

      setAnnotations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, note } : a))
      );
      cancelEdit();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAnnotation = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/annotations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete annotation");

      setAnnotations((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirmId(null);
    }
  };

  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg flex gap-6">
      {/* Left sidebar for annotations */}
      <div className="w-1/3 p-4 border rounded bg-gray-50 h-[80vh] overflow-y-auto sticky top-20">
        <h2 className="font-bold mb-4 text-green-700 text-xl">
          📌 Annotations
        </h2>
        {annotations.length === 0 ? (
          <p className="italic text-gray-500">No annotations yet.</p>
        ) : (
          annotations.map((ann) => (
            <div key={ann.id} className="mb-4 p-3 border-b border-gray-200">
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
                      onClick={() => updateAnnotation(ann.id)}
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
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => startEdit(ann.id, ann.note)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowConfirmId(ann.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
              {showConfirmId === ann.id && (
                <ConfirmModal
                  message="Are you sure you want to delete this annotation?"
                  onConfirm={() => deleteAnnotation(ann.id)}
                  onCancel={() => setShowConfirmId(null)}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Main content area */}
      <div className="w-2/3 flex flex-col">
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
    </div>
  );
}

export default TextFileViewer;

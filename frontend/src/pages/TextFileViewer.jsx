import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function TextFileViewer() {
  const { fileId } = useParams();
  const [content, setContent] = useState("");
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");

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

    fetchFileContent();
    fetchAnnotations();
  }, [fileId, token]);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection.toString();
    if (text.trim()) {
      setSelectedText(text);
    } else {
      setSelectedText("");
    }
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
          note: note,
        }),
      });

      if (!response.ok) throw new Error("Failed to save annotation");

      await fetchAnnotations();

      setSelectedText("");
      setNote("");
    } catch (err) {
      console.error(err.message);
    }
  };

  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg flex gap-6">
      <div className="w-1/3 p-4 border rounded bg-gray-50 h-[80vh] overflow-y-auto sticky top-20">
        <h2 className="font-bold mb-4 text-green-700 text-xl">
          📌 Annotations
        </h2>
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
              <p>
                <span className="font-semibold text-gray-600">Note:</span>{" "}
                {ann.note}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">By:</span>{" "}
                {ann.username || "Unknown"}
              </p>
            </div>
          ))
        )}
      </div>

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

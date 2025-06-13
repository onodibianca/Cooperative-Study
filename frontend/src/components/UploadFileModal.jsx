import { useState } from "react";

function UploadFileModal({ onUpload, onCancel }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    onUpload(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 border-4 border-orange-200 rounded-3xl w-[400px] p-10 shadow-xl flex flex-col space-y-6"
      >
        <h2 className="text-2xl text-gray-700 font-serif text-center">
          Upload New File
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border border-lime-100 rounded px-4 py-2"
        />
        <div className="flex justify-around">
          <button
            type="submit"
            className="px-6 py-2 bg-green-100 hover:bg-green-400 text-gray-700 rounded-xl"
          >
            Upload
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-orange-200/80 hover:bg-gray-400 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadFileModal;

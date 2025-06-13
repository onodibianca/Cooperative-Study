import { Link } from "react-router-dom";

function FileItem({ file, onDelete }) {
  return (
    <div className="p-4 border-b border-orange-200 flex justify-between items-center text-orange-400">
      {/* File Info */}
      <div>
        <p>
          <strong>Name:</strong>{" "}
          <span className="text-gray-600">{file.filename}</span>
        </p>
        <p>
          <strong>Type:</strong>{" "}
          <span className="text-gray-600">{file.filetype || "text/plain"}</span>
        </p>
        <p>
          <strong>Size:</strong>{" "}
          <span className="text-gray-600">{file.filesize || "N/A"} bytes</span>
        </p>
        <p>
          <strong>Uploaded:</strong>{" "}
          <span className="text-gray-600">{file.upload_date}</span>
        </p>
      </div>

      {/* Buttons */}
      <div className="space-x-2">
        {/* Read Button */}
        <Link to={`/files/${file.id}/view`}>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
            Read
          </button>
        </Link>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="bg-orange-300 hover:bg-orange-400 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default FileItem;

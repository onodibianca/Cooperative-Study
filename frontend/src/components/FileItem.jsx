import { FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";

function FileItem({ file, onDelete, showOwner = false }) {
  return (
    <div className="relative bg-white border border-orange-200 rounded-2xl shadow hover:shadow-lg p-4 flex flex-col items-center justify-between w-40 h-40 transition group">
      {/* File Icon */}
      <FaBook className="text-4xl text-green-500" />

      {/* File Title */}
      <div className="text-center text-sm font-semibold text-gray-700 truncate w-full mt-2">
        {file.filename}
      </div>

      {/* Upload Date */}
      <div className="text-xs text-gray-400">
        {new Date(file.upload_date).toLocaleDateString()}
      </div>

      {/* Owner (if shown) */}
      {showOwner && file.owner_username && (
        <div className="text-xs text-gray-500 mt-1 truncate w-full text-center">
          by {file.owner_username}
        </div>
      )}

      {/* Actions */}
      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
        <Link to={`/files/${file.id}/view`}>
          <button
            title="Read"
            className="text-xs text-white bg-blue-500 hover:bg-blue-600 rounded px-2 py-0.5"
          >
            Read
          </button>
        </Link>
        <button
          onClick={onDelete}
          title="Delete"
          className="text-xs text-white bg-orange-300 hover:bg-orange-400 rounded px-2 py-0.5"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default FileItem;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaEnvelope } from "react-icons/fa";

import FileItem from "../components/FileItem";
import ConfirmModal from "../components/ConfirmModal";
import UploadFileModal from "../components/UploadFileModal";
import FriendsModal from "../components/FriendsModal";
import FriendRequestsModal from "../components/FriendRequestsModal";

import { fetchFiles, deleteFile, uploadFile } from "../api/api";

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showFriendRequestsModal, setShowFriendRequestsModal] = useState(false);

  const navigate = useNavigate();

  const loadFiles = async () => {
    try {
      const data = await fetchFiles();
      setFiles(data);
    } catch (err) {
      setError(err.message || "Error loading files");
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDelete = async () => {
    if (!fileToDelete) return;
    try {
      await deleteFile(fileToDelete);
      setFiles(files.filter((file) => file.id !== fileToDelete));
      setShowConfirm(false);
      setFileToDelete(null);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpload = async (fileData) => {
    try {
      await uploadFile(fileData);
      setShowUpload(false);
      setError("");
      loadFiles();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-green-100 min-h-screen flex justify-center items-start pt-4 relative">
      <div className="bg-white/80 border-4 border-orange-200 rounded-3xl w-[800px] h-[90vh] p-20 shadow-xl relative overflow-y-auto">
        {/* Top Right User Icon */}
        <div className="absolute top-6 right-6 flex space-x-4">
          <button
            onClick={() => setShowFriendsModal(true)}
            title="Friends List"
          >
            <FaUsers className="text-4xl text-orange-300 hover:text-orange-500" />
          </button>

          <button
            onClick={() => setShowFriendRequestsModal(true)}
            title="Friend Requests"
          >
            <FaEnvelope className="text-4xl text-orange-300 hover:text-orange-500" />
          </button>
        </div>

        <div className="text-[50px] text-orange-200 font-serif mb-16 text-center">
          YOUR FILES
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="max-h-[60vh] overflow-y-auto space-y-4">
          {files.length === 0 ? (
            <p className="text-gray-600">No files found.</p>
          ) : (
            files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onDelete={() => {
                  setFileToDelete(file.id);
                  setShowConfirm(true);
                }}
              />
            ))
          )}
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="absolute bottom-10 right-10 px-10 py-4 bg-green-100 hover:bg-green-400 text-gray-700 rounded-xl"
        >
          Upload File
        </button>
      </div>

      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this file?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showUpload && (
        <UploadFileModal
          onUpload={handleUpload}
          onCancel={() => setShowUpload(false)}
        />
      )}

      {showFriendsModal && (
        <FriendsModal onClose={() => setShowFriendsModal(false)} />
      )}

      {showFriendRequestsModal && (
        <FriendRequestsModal
          onClose={() => setShowFriendRequestsModal(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaEnvelope } from "react-icons/fa";

import FileItem from "../components/FileItem";
import ConfirmModal from "../components/ConfirmModal";
import UploadFileModal from "../components/UploadFileModal";
import FriendsModal from "../components/FriendsModal";
import FriendRequestsModal from "../components/FriendRequestsModal";
import LogoutMenu from "../components/LogoutMenu";

import {
  fetchFiles,
  fetchFriendsFiles, // <-- new API function to fetch friends' files
  deleteFile,
  uploadFile,
  fetchFriendRequests,
} from "../api/api";

function Dashboard() {
  const [view, setView] = useState("your"); // "your" or "friends"
  const [files, setFiles] = useState([]);
  const [friendRequests, setFriendRequests] = useState({
    received: [],
    sent: [],
  });
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showFriendRequestsModal, setShowFriendRequestsModal] = useState(false);

  const navigate = useNavigate();

  // Load files depending on the current view
  const loadFiles = async () => {
    try {
      setError("");
      let data;
      if (view === "your") {
        data = await fetchFiles();
      } else {
        data = await fetchFriendsFiles();
      }
      setFiles(data);
    } catch (err) {
      setError(err.message || "Error loading files");
    }
  };

  const handleFriendRequestsChange = async () => {
    await loadFriendRequests(); // reload friend requests from backend
  };

  const loadFriendRequests = async () => {
    try {
      const data = await fetchFriendRequests();
      setFriendRequests(data);
    } catch (err) {
      console.error("Failed to load friend requests", err);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [view]); // reload files when view changes

  useEffect(() => {
    loadFriendRequests();
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

  const toggleView = () => {
    setView(view === "your" ? "friends" : "your");
  };

  return (
    <div className="bg-green-100 min-h-screen flex justify-center items-start pt-4 relative">
      <LogoutMenu />
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
            <FaEnvelope
              className={`text-4xl ${
                friendRequests.received.length > 0
                  ? "text-green-500 hover:text-green-700"
                  : "text-orange-300 hover:text-orange-500"
              }`}
            />
          </button>
        </div>

        {/* Header with toggle arrow */}
        <div className="flex items-center justify-center space-x-4 mb-16">
          <button
            onClick={toggleView}
            className="text-4xl text-orange-300 hover:text-orange-500"
            aria-label="Toggle files view"
          >
            {view === "your" ? "→" : "←"}
          </button>
          <h2 className="text-[50px] text-orange-200 font-serif select-none">
            {view === "your" ? "YOUR FILES" : "FRIENDS' FILES"}
          </h2>
          <div style={{ width: 40 }}></div> {/* spacer to balance the arrow */}
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="max-h-[60vh] overflow-y-auto">
          {files.length === 0 ? (
            <p className="text-gray-600">No files found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {files.map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  showOwner={view === "friends"} // only show when viewing friends’ files
                  onDelete={() => {
                    setFileToDelete(file.id);
                    setShowConfirm(true);
                  }}
                />
              ))}
            </div>
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
          onRequestsChange={handleFriendRequestsChange} // pass callback here
        />
      )}
    </div>
  );
}

export default Dashboard;

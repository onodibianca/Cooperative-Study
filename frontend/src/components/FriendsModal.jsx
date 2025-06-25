import { useEffect, useState } from "react";
import { fetchFriends, sendFriendRequest } from "../api/api";

function FriendsModal({ onClose }) {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState("");
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [newFriendUsername, setNewFriendUsername] = useState("");
  const [addFriendError, setAddFriendError] = useState("");
  const [addFriendSuccess, setAddFriendSuccess] = useState("");

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const friends = await fetchFriends();
        setFriends(friends);
      } catch (err) {
        setError(err.message || "Failed to load friends");
      }
    };

    loadFriends();
  }, []);

  const handleSendFriendRequest = async () => {
    setAddFriendError("");
    setAddFriendSuccess("");
    if (!newFriendUsername.trim()) {
      setAddFriendError("Please enter a username.");
      return;
    }

    try {
      await sendFriendRequest(newFriendUsername.trim());
      setAddFriendSuccess("Friend request sent!");
      setNewFriendUsername("");
    } catch (err) {
      setAddFriendError(err.message || "Failed to send friend request.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[500px] max-h-[80vh] overflow-y-auto p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-orange-400">Your Friends</h2>
          <button
            onClick={onClose}
            className="text-red-500 text-xl font-bold hover:text-red-700"
          >
            ✕
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex-grow overflow-y-auto mb-4">
          {friends.length === 0 ? (
            <p className="text-gray-500">No friends yet.</p>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {friends.map((f) => (
                <li key={f.id}>{f.username}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Friend Section */}
        {showAddFriendForm ? (
          <div className="border-t pt-4">
            <input
              type="text"
              placeholder="Enter username"
              value={newFriendUsername}
              onChange={(e) => setNewFriendUsername(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            {addFriendError && (
              <p className="text-red-500 mb-2">{addFriendError}</p>
            )}
            {addFriendSuccess && (
              <p className="text-green-500 mb-2">{addFriendSuccess}</p>
            )}
            <div className="flex space-x-2">
              <button
                onClick={handleSendFriendRequest}
                className="bg-green-400 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Send Friend Request
              </button>
              <button
                onClick={() => {
                  setShowAddFriendForm(false);
                  setAddFriendError("");
                  setAddFriendSuccess("");
                  setNewFriendUsername("");
                }}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddFriendForm(true)}
            className="mt-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded"
          >
            Add Friend
          </button>
        )}
      </div>
    </div>
  );
}

export default FriendsModal;

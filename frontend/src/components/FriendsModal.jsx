import { useEffect, useState } from "react";
import { fetchFriends } from "../api/api"; // remove fetchFriendRequests import

function FriendsModal({ onClose }) {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState("");

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[500px] max-h-[80vh] overflow-y-auto p-6">
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

        <div>
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
      </div>
    </div>
  );
}

export default FriendsModal;

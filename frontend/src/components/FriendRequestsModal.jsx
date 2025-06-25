import { useEffect, useState } from "react";
import {
  fetchFriendRequests,
  acceptFriendRequest,
  deleteFriendRequest,
} from "../api/api";

function FriendRequestsModal({ onClose }) {
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("received");
  const [loading, setLoading] = useState(false);

  const loadRequests = async () => {
    try {
      const data = await fetchFriendRequests();
      setRequests(data);
    } catch (err) {
      setError(err.message || "Failed to load friend requests");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (id) => {
    setLoading(true);
    try {
      await acceptFriendRequest(id);
      await loadRequests();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteFriendRequest(id);
      await loadRequests();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[450px] max-h-[80vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-orange-400">
            Friend Requests
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 text-xl font-bold hover:text-red-700"
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setActiveTab("received")}
            className={`flex-1 px-4 py-2 rounded ${
              activeTab === "received"
                ? "bg-orange-400 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Received
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`flex-1 px-4 py-2 rounded ${
              activeTab === "sent"
                ? "bg-orange-400 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Sent
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "received" ? (
          requests.received.length === 0 ? (
            <p className="text-gray-500">No new friend requests.</p>
          ) : (
            <ul className="space-y-3">
              {requests.received.map((r) => (
                <li
                  key={r.id}
                  className="border rounded p-3 flex justify-between items-center"
                >
                  <span className="text-gray-800"> {r.from}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAccept(r.id)}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={loading}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : requests.sent.length === 0 ? (
          <p className="text-gray-500">No pending friend requests.</p>
        ) : (
          <ul className="space-y-3">
            {requests.sent.map((r) => (
              <li
                key={r.id}
                className="border rounded p-3 flex justify-between items-center"
              >
                <span className="text-gray-800">To: {r.to}</span>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={loading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FriendRequestsModal;

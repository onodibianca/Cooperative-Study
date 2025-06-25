import { useEffect, useState } from "react";
import { fetchFriendRequests } from "../api/api";

function FriendRequestsModal({ onClose }) {
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchFriendRequests();
        setRequests(data);
      } catch (err) {
        setError(err.message || "Failed to load friend requests");
      }
    };

    loadRequests();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[400px] max-h-[80vh] overflow-y-auto p-6">
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

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {requests.received.length === 0 && requests.sent.length === 0 ? (
          <p className="text-gray-500">No pending friend requests.</p>
        ) : (
          <>
            {requests.received.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Received
                </h3>
                <ul className="list-disc list-inside">
                  {requests.received.map((r) => (
                    <li key={r.id}>From: {r.from}</li>
                  ))}
                </ul>
              </div>
            )}

            {requests.sent.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Sent</h3>
                <ul className="list-disc list-inside">
                  {requests.sent.map((r) => (
                    <li key={r.id}>To: {r.to}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FriendRequestsModal;

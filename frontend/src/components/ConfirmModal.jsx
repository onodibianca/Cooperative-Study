function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center space-y-4 w-80">
        <p className="text-lg font-semibold text-gray-700">{message}</p>
        <div className="flex justify-around mt-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-orange-300 rounded hover:bg-orange-400"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

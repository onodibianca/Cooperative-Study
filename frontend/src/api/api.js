const FILE_API_URL = "http://127.0.0.1:5000/api/files";
const ANNOTATION_API_URL = "http://127.0.0.1:5000/annotations";
const SOCIAL_API_URL = "http://127.0.0.1:5000/social";

const getToken = () => localStorage.getItem("access_token");

export async function fetchFiles() {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(FILE_API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.msg || "Failed to fetch files");
  }
  return res.json();
}

export async function deleteFile(id) {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(`${FILE_API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.msg || "Failed to delete file");
  }
  return true;
}

export async function uploadFile(file) {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(FILE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.msg || "Failed to upload file");
  }
  return res.json();
}

export async function fetchFileContent(id) {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  const response = await fetch(`${FILE_API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch file content");
  return response.text();
}

export async function fetchAnnotationsByFile(fileId) {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(`${ANNOTATION_API_URL}/file/${fileId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch annotations");
  return res.json();
}

export async function createAnnotation({ file_id, selected_text, note }) {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(`${ANNOTATION_API_URL}/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file_id, selected_text, note }),
  });

  if (!res.ok) throw new Error("Failed to create annotation");
  return res.json();
}

export async function deleteAnnotation(id) {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(`${ANNOTATION_API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete annotation");
  return true;
}

export async function updateAnnotation(id, note) {
  const token = getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${ANNOTATION_API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ note }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.msg || "Failed to update annotation");
  }

  return res.json();
}

export async function fetchAnnotationsByFileAndUser(fileId, username) {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(
    `${ANNOTATION_API_URL}/file/${fileId}/user/${encodeURIComponent(username)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.msg || "Failed to fetch filtered annotations");
  }

  return res.json();
}

export async function fetchFriends() {
  const token = getToken();
  if (!token) throw new Error("No token found.");

  const res = await fetch(`${SOCIAL_API_URL}/friends`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch friends.");
  return res.json();
}

export async function fetchFriendRequests() {
  const token = getToken();
  if (!token) throw new Error("No token found.");

  const res = await fetch(`${SOCIAL_API_URL}/friend-requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch friend requests.");
  return res.json();
}

export async function acceptFriendRequest(requestId) {
  const token = getToken();
  const res = await fetch(
    `${SOCIAL_API_URL}/friend-request/accept/${requestId}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) throw new Error("Failed to accept friend request.");
  return res.json();
}

export async function deleteFriendRequest(requestId) {
  const token = getToken();
  const res = await fetch(
    `${SOCIAL_API_URL}/friend-request/delete/${requestId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) throw new Error("Failed to delete/reject friend request.");
  return res.json();
}

export async function removeFriend(friendId) {
  const token = getToken();
  const res = await fetch(`${SOCIAL_API_URL}/friends/remove/${friendId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to remove friend.");
  return res.json();
}

export async function sendFriendRequest(username) {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(`${SOCIAL_API_URL}/friend-request/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Failed to send friend request.");
  }
  return res.json();
}

export async function fetchFriendsFiles() {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(`${FILE_API_URL}/friends`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.msg || "Failed to fetch friends' files");
  }
  return res.json();
}

export async function fetchFileContentFriend(id) {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  const response = await fetch(`${FILE_API_URL}/friends/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch friend's file content");

  return response.text();
}

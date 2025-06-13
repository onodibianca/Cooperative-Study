const API_URL = "http://127.0.0.1:5000/api/files";

const getToken = () => localStorage.getItem("access_token");

export async function fetchFiles() {
  const token = getToken();
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(API_URL, {
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

  const res = await fetch(`${API_URL}/${id}`, {
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

  const res = await fetch(API_URL, {
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

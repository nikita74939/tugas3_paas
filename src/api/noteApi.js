import { API_BASE } from "../constants/config";

export async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// ── Notes ─────────────────────────────────────────────────
export const notesApi = {
  getAll: (folderId, query) => {
    let path = "/notes";
    const params = [];
    if (folderId && folderId !== "all") params.push(`folder_id=${folderId}`);
    if (query) params.push(`search=${encodeURIComponent(query)}`);
    if (params.length) path += "?" + params.join("&");
    return apiFetch(path);
  },
  create: (payload) =>
    apiFetch("/notes", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) =>
    apiFetch(`/notes/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  delete: (id) =>
    apiFetch(`/notes/${id}`, { method: "DELETE" }),
};

// ── Folders ───────────────────────────────────────────────
export const foldersApi = {
  getAll: () => apiFetch("/folders"),
  create: (payload) =>
    apiFetch("/folders", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) =>
    apiFetch(`/folders/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  delete: (id) =>
    apiFetch(`/folders/${id}`, { method: "DELETE" }),
};
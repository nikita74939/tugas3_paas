import { FOLDER_COLORS } from "../constants/config";

export function formatDate(str) {
  if (!str) return "";
  return new Date(str).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function folderColor(id) {
  return FOLDER_COLORS[id % FOLDER_COLORS.length];
}
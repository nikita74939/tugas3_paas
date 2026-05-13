import { useState, useCallback } from "react";
import { foldersApi } from "../api";

export function useFolders() {
  const [folders, setFolders] = useState([]);

  const loadFolders = useCallback(async () => {
    try {
      const data = await foldersApi.getAll();
      setFolders(data);
    } catch {}
  }, []);

  return { folders, loadFolders };
}
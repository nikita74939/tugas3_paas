import { useState, useCallback } from "react";
import { notesApi } from "../api";

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [allCount, setAllCount] = useState(0);

  const loadNotes = useCallback(async (folderId = null, query = "") => {
    try {
      const data = await notesApi.getAll(folderId, query);
      setNotes(data);
    } catch {}
  }, []);

  const loadAllCount = useCallback(async () => {
    try {
      const data = await notesApi.getAll(null, "");
      setAllCount(data.length);
    } catch {}
  }, []);

  return { notes, allCount, loadNotes, loadAllCount };
}
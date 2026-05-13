import { useState, useRef } from "react";

export function useToast() {
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);

  function showToast(msg) {
    setMessage(msg);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMessage(""), 2500);
  }

  return { message, showToast };
}
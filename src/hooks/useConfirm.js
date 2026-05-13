import { useState } from "react";

export function useConfirm() {
  const [state, setState] = useState(null);

  function showConfirm({ title, sub, icon = "🗑️", okLabel = "Delete" }) {
    return new Promise((resolve) => {
      setState({ title, sub, icon, okLabel, resolve });
    });
  }

  function handleOk() {
    state?.resolve(true);
    setState(null);
  }

  function handleCancel() {
    state?.resolve(false);
    setState(null);
  }

  return { confirmState: state, showConfirm, handleOk, handleCancel };
}
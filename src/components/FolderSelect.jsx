import { useState, useEffect, useRef } from "react";
import { FolderIcon, FolderSmIcon, ChevronDownIcon } from "./Icons";
import { folderColor } from "../utils";

export function FolderSelect({ folders, value, onChange }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, minWidth: 0 });

  useEffect(() => {
    const handleClick = (e) => {
      if (
        !dropdownRef.current?.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleOpen = (e) => {
    e.stopPropagation();
    if (!open) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: rect.left, minWidth: rect.width });
    }
    setOpen((v) => !v);
  };

  const selectedFolder = folders.find((f) => f.id == value);
  const label = selectedFolder ? selectedFolder.nama : "No folder";

  return (
    <>
      <div
        ref={triggerRef}
        className={`edit-folder-wrap custom-select-trigger ${open ? "open" : ""}`}
        onClick={handleOpen}
      >
        <FolderSmIcon />
        <span className="custom-select-label">{label}</span>
        <ChevronDownIcon />
      </div>

      <div
        ref={dropdownRef}
        className={`custom-select-dropdown ${open ? "open" : ""}`}
        style={{ top: pos.top, left: pos.left, minWidth: pos.minWidth }}
      >
        <ul>
          <li
            className={!value ? "selected" : ""}
            onClick={() => { onChange(""); setOpen(false); }}
          >
            <span className="opt-dot" /> No folder
          </li>
          {folders.map((f) => (
            <li
              key={f.id}
              className={f.id == value ? "selected" : ""}
              onClick={() => { onChange(f.id); setOpen(false); }}
            >
              <FolderIcon color={folderColor(f.id)} />
              {f.nama}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
export const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
    <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const FolderIcon = ({ color = "#F7618E" }) => (
  <svg width="24" height="20" viewBox="0 0 24 20" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M1 5.5A2.5 2.5 0 013.5 3h4.086a1 1 0 01.707.293L9.5 4.5H20.5A2.5 2.5 0 0123 7v9a2.5 2.5 0 01-2.5 2.5h-17A2.5 2.5 0 011 16V5.5z"
      fill={color}
      fillOpacity="0.18"
      stroke={color}
      strokeWidth="1.4"
    />
  </svg>
);

export const BackIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" width="17" height="17">
    <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TrashIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
    <path d="M5 6h10M8 6V4h4v2M6 6l1 9h6l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ChevronDownIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" width="12" height="12" style={{ marginLeft: 2, opacity: 0.5 }}>
    <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FolderSmIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
    <path
      d="M2 7.5A2.5 2.5 0 014.5 5h2.086a1 1 0 01.707.293L8.5 6.5H15.5A2.5 2.5 0 0118 9v5a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 012 14V7.5z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

export const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
    <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);
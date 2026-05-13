export function ConfirmModal({ open, icon, title, sub, okLabel, onOk, onCancel }) {
  return (
    <div className={`modal-overlay ${open ? "open" : ""}`} onClick={onCancel}>
      <div
        className="modal-card"
        style={{ maxWidth: 360, textAlign: "center" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-body" style={{ padding: "28px 28px 0" }}>
          <span className="confirm-icon">{icon}</span>
          <p className="confirm-title">{title}</p>
          <p className="confirm-sub">{sub}</p>
        </div>
        <div
          className="modal-footer"
          style={{ padding: "20px 28px 28px", justifyContent: "center", gap: 12 }}
        >
          <button className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onOk}>
            {okLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
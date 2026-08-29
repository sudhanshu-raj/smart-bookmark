import { useState, useRef, useEffect } from "react";
import "../styles/bookMarkCard.css";
import historyIcon from "../assets/history.png";

export default function BookMarkCard({
  name,
  url,
  icon,
  lastVisited,
  showLastVisited = true,
  onDragStart,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
}) {
  const title = name || "Untitled Bookmark";
  const targetUrl = url || "#";

  const [imgError, setImgError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  let faviconUrl = icon;
  if (!faviconUrl && targetUrl && targetUrl !== "#") {
    try {
      const domain = new URL(targetUrl).hostname;
      if (domain && !domain.includes("newtab") && !domain.includes("localhost")) {
        faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      }
    } catch {
      faviconUrl = null;
    }
  }

  const shouldShowLastVisited = Boolean(showLastVisited && lastVisited);
  const formattedLastVisited = shouldShowLastVisited
    ? typeof lastVisited === "number" || typeof lastVisited === "string"
      ? new Date(lastVisited).toLocaleDateString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : String(lastVisited)
    : null;

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  function handleMenuToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  }

  function handleEdit(e) {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    if (onEdit) onEdit();
  }

  function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    if (onDelete) onDelete();
  }

  return (
    <div className="bookmark-card-wrapper" ref={menuRef}>
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bookmark-card"
        draggable="true"
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className="bookmark-card-header">
          <div className="bookmark-card-icon">
            {faviconUrl && !imgError ? (
              <img
                src={faviconUrl}
                alt=""
                className="bookmark-icon-img"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="bookmark-icon-fallback">
                {title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="bookmark-card-title">{title}</span>
        </div>

        {shouldShowLastVisited && formattedLastVisited && (
          <div className="bookmark-card-footer">
            <span className="bookmark-card-visited">
              <img src={historyIcon} alt="history" className="history-icon-img" />
              {formattedLastVisited}
            </span>
          </div>
        )}
      </a>

      {/* Three-dot menu button — shown on wrapper hover via CSS */}
      <button
        className="bm-menu-btn"
        onClick={handleMenuToggle}
        aria-label="Options"
        aria-expanded={menuOpen}
        id={`bm-menu-btn-${name?.replace(/\s+/g, "-").toLowerCase()}`}
      >
        ⋮
      </button>

      {menuOpen && (
        <div className="bm-menu-dropdown" role="menu">
          <button
            className="bm-menu-item"
            onClick={handleEdit}
            role="menuitem"
            id="bm-menu-edit"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M9.5 1.5l2 2L4 11H2v-2L9.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit
          </button>
          <button
            className="bm-menu-item danger"
            onClick={handleDelete}
            role="menuitem"
            id="bm-menu-delete"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 3.5h9M5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M10.5 3.5l-.6 7a.5.5 0 01-.5.5H3.6a.5.5 0 01-.5-.5l-.6-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

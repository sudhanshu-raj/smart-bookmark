

import "./styles/bookMarkCard.css";

export default function BookMarkCard({ name, url, icon, lastVisited, showLastVisited = true }) {
  const title = name || "Untitled Bookmark";
  const targetUrl = url || "#";
  
  let faviconUrl = icon;
  if (!faviconUrl && targetUrl && targetUrl !== "#") {
    try {
      const domain = new URL(targetUrl).hostname;
      faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      faviconUrl = null;
    }
  }

  const shouldShowLastVisited = Boolean(showLastVisited && lastVisited);

  const formattedLastVisited = shouldShowLastVisited
    ? typeof lastVisited === "number" || typeof lastVisited === "string"
      ? new Date(lastVisited).toLocaleDateString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          month: "short",
          day: "numeric",
          year: "numeric"
        })
      : String(lastVisited)
    : null;

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bookmark-card"
    >
      <div className="bookmark-card-header">
        <div className="bookmark-card-icon">
          {faviconUrl ? (
            <img src={faviconUrl} alt="" className="bookmark-icon-img" />
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
            Last visited: {formattedLastVisited}
          </span>
        </div>
      )}
    </a>
  );
}


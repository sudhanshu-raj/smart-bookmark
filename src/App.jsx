import { useState, useEffect } from "react";
import { getBookmarks, moveBookmarks } from "./services/bookmark";
import BookMarkCard from "./bookMarkCard";

function App() {
  const [bookmarks, setBookmarks] = useState({});
  const [bookmarksURL, setBookmarksURL] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedId, setDraggedId] = useState(null);
  const [useFolderURLs, setUseFolderURLs] = useState(false);

  useEffect(() => {
    console.log("app loaded!");
    getBookmarks()
      .then((bookmarks) => {
        console.log("original marks: ", bookmarks);
        const rootChildren = bookmarks[0]?.children || [];
        const urls = extractBookmarkUrls(rootChildren);
        setBookmarksURL(urls);
        console.log("root children : ", rootChildren); 
        setBookmarks(transformBookmarkTree(rootChildren));
      })
      .catch(console.error);
  }, []);

  function extractBookmarkUrls(nodes) {
    const result = [];

    function traverse(treeNodes) {
      for (const node of treeNodes) {
        if (node.url) {
          result.push({
            id: node.id,
            title: node.title,
            url: node.url,
            parentId: node.parentId,
            dateAdded: node.dateAdded,
            dateLastUsed: node.dateLastUsed ?? null,
            index: node.index,
          });
        }

        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      }
    }

    traverse(nodes);
    return result;
  }

  function transformBookmarkTree(nodes) {
    const result = {};

    for (const node of nodes) {
      if (node.children) {
        const bookmarks = [];

        const subfolders = transformBookmarkTree(node.children);

        for (const child of node.children) {
          if (child.url) {
            bookmarks.push({
              id: child.id,
              title: child.title,
              url: child.url,
              parentId: child.parentId,
              dateAdded: child.dateAdded,
              index: child.index,
            });
          }
        }

        // Store folder with metadata and child collections
        result[node.id] = {
          id: node.id,
          title: node.title,
          parentId: node.parentId,
          dateAdded: node.dateAdded,
          dateGroupModified: node.dateGroupModified,
          index: node.index,
          bookmarks: bookmarks,
          subfolders: subfolders,
        };
      }
    }

    return result;
  }

  function shortBookMarksURL(type) {
    if (type === "name") {
      const sorted = [...bookmarksURL].sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      setBookmarksURL(sorted);
    } else if (type === "dateAdded") {
      const sorted = [...bookmarksURL].sort((a, b) => {
        const dateA = new Date(a.dateAdded);
        const dateB = new Date(b.dateAdded);
        return dateB - dateA;
      });
      setBookmarksURL(sorted);
    }
  }

  const handleDragStart = (id) => {
    setDraggedId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, dropId) => {
    e.preventDefault();
    if (!draggedId || draggedId === dropId) return;

    const draggedIndex = bookmarksURL.findIndex((b) => b.id === draggedId);
    const dropIndex = bookmarksURL.findIndex((b) => b.id === dropId);

    if (draggedIndex === -1 || dropIndex === -1) return;

    const updatedList = [...bookmarksURL];
    const [movedItem] = updatedList.splice(draggedIndex, 1);
    updatedList.splice(dropIndex, 0, movedItem);

    setBookmarksURL(updatedList);
    setDraggedId(null);

    const targetItem = bookmarksURL[dropIndex];

    if (movedItem && targetItem) {
      try {
        await moveBookmarks(
          movedItem.id,
          targetItem.parentId,
          targetItem.index,
        );
      } catch (err) {
        console.log("Error while moving bookmark :", err);
      }
    }
  };

  const filteredBookmarks = bookmarksURL.filter((bookmark) => {
    const searchResult = bookmark.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchFolderResult = useFolderURLs
      ? true
      : bookmark.parentId === "1" ||
        bookmark.parentId === "2" ||
        bookmark.parentId === "3";

    return searchResult && matchFolderResult;
  });

  return (
    <>
      <section className="bookmark-body">
        <p>The Smart Bookmark manager</p>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search bookmarks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="shorting">
          <label htmlFor="short">Choose shorting by : </label>
          <select
            name="short"
            id="short"
            onChange={(e) => shortBookMarksURL(e.target.value)}
          >
            <option value="">Select sorting...</option>
            <option value="name">Name</option>
            <option value="dateAdded">Date Added</option>
            <option value="lastUsed">Last Used</option>
          </select>
        </div>

        <div>
          <label htmlFor="folderURLs">Check folders URL</label>
          <input
            name="folderURLs"
            type="checkbox"
            onChange={() => setUseFolderURLs((prev) => !prev)}
          />
        </div>

        <div className="bookmarks-list">
          {filteredBookmarks.map((value) => (
            <BookMarkCard
              key={value.id}
              name={value.title}
              url={value.url}
              lastVisited={value.dateLastUsed}
              showLastVisited={false}
              onDragStart={() => handleDragStart(value.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, value.id)}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default App;

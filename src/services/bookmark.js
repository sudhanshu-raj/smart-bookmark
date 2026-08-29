export function removeBookmark(id) {
  return new Promise((resolve, reject) => {
    if (typeof chrome === "undefined" || !chrome?.bookmarks) {
      console.warn("chrome.bookmarks API is not available");
      resolve(null);
      return;
    }
    chrome.bookmarks.remove(id, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

export function updateBookmark(id, title, url) {
  return new Promise((resolve, reject) => {
    if (typeof chrome === "undefined" || !chrome?.bookmarks) {
      console.warn("chrome.bookmarks API is not available");
      resolve(null);
      return;
    }
    chrome.bookmarks.update(id, { title, url }, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result);
      }
    });
  });
}

export function getBookmarks() {
  return new Promise((resolve, reject) => {
    if (typeof chrome === "undefined" || !chrome?.bookmarks) {
      console.warn(
        "chrome.bookmarks API is not available (running in browser dev mode)",
      );
      resolve(null);
      return;
    }

    chrome.bookmarks.getTree((tree) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      resolve(tree);
    });
  });
}

export function moveBookmarks(id, parentId, index) {
  return new Promise((resolve, reject) => {
    if (typeof chrome === "undefined" || !chrome?.bookmarks) {
      console.warn(
        "chrome.bookmarks API is not available (running in browser dev mode)",
      );
      resolve(null);
      return;
    }

    chrome.bookmarks.move(
      id,
      { parentId: parentId, index: index },
      (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      },
    );
  });
}
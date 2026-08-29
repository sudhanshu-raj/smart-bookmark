import { db, auth } from "./fireBaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
  if (!bookmark.url) return;

  const [activeTab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  const isFromIncognito = activeTab ? Boolean(activeTab.incognito) : false;

  if (!isFromIncognito) {
    return;
  }

  console.log(
    `Bookmark added from ${isFromIncognito ? "Incognito" : "Normal"} tab:`,
    bookmark.url,
  );

  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("User is not authenticated!");
      return;
    }
    const bookmarksCollectionRef = collection(
      db,
      "users",
      currentUser.uid,
      "bookmarks",
    );
    await addDoc(bookmarksCollectionRef, {
      title: bookmark.title,
      url: bookmark.url,
      isIncognito: isFromIncognito,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving to Firestore:", error);
  }
});

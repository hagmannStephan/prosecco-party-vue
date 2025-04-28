import { openDB } from 'idb';

const DB_NAME = 'name-of-the-game-db';
const STORE_NAME = 'activity-word-list-store'; // Think of it like a table name in SQL

// Open or create the IndexedDB
async function openWordListDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      // Create an object store and specifie the word property of objects as primary key
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'word' });
    },
  });
  return db;
}

// Load the word list from IndexedDB or fetch from network
async function loadWordListFromIndexedDB(): Promise<string[]> {
  const db = await openWordListDB();
  const wordList: string[] = [];
  
  // Try fetching the word list from IndexedDB
  let cursor = await db.transaction(STORE_NAME).objectStore(STORE_NAME).openCursor();
  while (cursor) {
    wordList.push(cursor.value.word);
    cursor = await cursor.continue();
  }

  // If no data exists in IndexedDB, fetch from public folder
  if (wordList.length === 0) {
    console.log('No data in IndexedDB, fetching from network...');
    const response = await fetch('/games/activity/word-list.json');
    const data = await response.json();

    // Save the words individually in IndexedDB
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    data.forEach((item: { word: string; difficulty: string; forbidden: string[] }) => {
      store.put(item); // Store each word's object separately
    });
    await tx.done;
    console.log('Data saved to IndexedDB');
    return data.map((item: { word: string }) => item.word); // Return word list
  }
  
  console.log('Loaded from IndexedDB');
  return wordList;
}

export async function loadWordList(): Promise<string[] | undefined> {
  // Execute if the app is in PWA mode
  if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
    return await loadWordListFromIndexedDB();
  }

  // If not in PWA mode, fetch from network
  try {
    const response = await fetch('/games/activity/word-list.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.map((item: { word: string }) => item.word); // Return word list
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return undefined; // Return undefined if fetch fails
  }
}
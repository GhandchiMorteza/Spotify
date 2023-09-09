class SongStorage {
  private dbName: string = "MySongDatabase";
  private storeName: string = "mp3Songs";

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    const request = indexedDB.open(this.dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(this.storeName)) {
        const objectStore = db.createObjectStore(this.storeName, {
          keyPath: "id",
        });

        // Define an index for URL
        objectStore.createIndex("urlIndex", "url", { unique: true });
      }
    };

    request.onsuccess = () => {};

    request.onerror = (event) => {
      console.error(
        "Database error:",
        (event.target as IDBOpenDBRequest).error
      );
    };
  }

  async addMP3Song(id: string, url: string, songBlob: Blob): Promise<string> {
    const db = await this.openDatabase();
    const transaction = db.transaction(this.storeName, "readwrite");
    const store = transaction.objectStore(this.storeName);

    const songRecord = { id, url, audioBlob: songBlob };

    const request = store.add(songRecord);

    return new Promise<string>((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve(id);
      };

      request.onerror = (event) => {
        const target = event.target as IDBRequest;
        reject(target.error || new Error("Unknown database error"));
      };
    });
  }

  async getMP3SongById(id: string): Promise<Blob | null> {
    const db = await this.openDatabase();
    const transaction = db.transaction(this.storeName, "readonly");
    const store = transaction.objectStore(this.storeName);

    return new Promise<Blob | null>((resolve, reject) => {
      const request = store.get(id);

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        if (result && result.audioBlob) {
          resolve(result.audioBlob);
        } else {
          resolve(null);
        }
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  private async openDatabase(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName);

      request.onsuccess = () => {
        const db = request.result;
        resolve(db);
      };

      request.onerror = (event) => {
        const target = event.target as IDBRequest;
        reject(target.error);
      };
    });
  }
}

export default SongStorage;

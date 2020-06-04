import { DB_NAME, DB_VERSION } from "./config";
import { todoStore } from "./todo";

let dbCache: IDBDatabase | undefined;

const openDb = (): Promise<IDBDatabase> => {
  if (dbCache) {
    return Promise.resolve(dbCache);
  }

  const req = indexedDB.open(DB_NAME, DB_VERSION);

  return new Promise((resolve, reject) => {
    req.onsuccess = () => {
      dbCache = req.result;
      resolve(dbCache);
    };
    req.onerror = () => {
      console.error(req.error);
      reject(req.error);
    };
    req.onupgradeneeded = () => {
      const db = req.result;
      db.onerror = reject;

      defineSchema(db);

      db.onerror = null;
    };
  });
};

const defineSchema = (db: IDBDatabase) => {
  console.log("define schema...");

  const todoDB = db.createObjectStore(todoStore.name, { keyPath: "id" });
  todoDB.createIndex(todoStore.idIndex, "id");
};

export class Database {
  private db: IDBDatabase | undefined;

  constructor() {
    openDb().then((db) => {
      this.db = db;
    });
  }

  async getDb(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    this.db = await openDb();

    return this.db;
  }
}

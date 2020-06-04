import { Database } from ".";
import { v4 as uuidv4 } from "uuid";

export const todoStore = {
  name: "todo",
  idIndex: "id",
};

export type Todo = {
  id: string;
  value: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
};

class TodoDatabase extends Database {
  constructor() {
    super();

    this.getDb = this.getDb.bind(this);
    this.getAll = this.getAll.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
  }

  async getAll(): Promise<Todo[]> {
    const db = await this.getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(todoStore.name, "readonly");
      transaction.onerror = reject;

      const store = transaction.objectStore(todoStore.name);
      const index = store.index(todoStore.idIndex);
      const req: IDBRequest<Todo[]> = index.getAll();

      req.onsuccess = () => {
        resolve(req.result);
      };
    });
  }

  private async get(id: Todo["id"]): Promise<Todo> {
    const db = await this.getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(todoStore.name, "readwrite");
      transaction.onerror = reject;

      const store = transaction.objectStore(todoStore.name);

      const req: IDBRequest<Todo | undefined> = store.get(id);

      req.onsuccess = () => {
        if (!req.result) {
          reject("not found");
          return;
        }

        resolve(req.result);
      };
    });
  }

  async create(args: Pick<Todo, "value">): Promise<Todo> {
    const db = await this.getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(todoStore.name, "readwrite");
      transaction.onerror = reject;
      const store = transaction.objectStore(todoStore.name);

      const now = new Date();
      const newTodo: Todo = {
        ...args,
        id: uuidv4(),
        done: false,
        createdAt: now,
        updatedAt: now,
      };

      const req: IDBRequest = store.put(newTodo);

      req.onsuccess = () => {
        resolve(newTodo);
      };
    });
  }

  async update(id: Todo["id"], args: Partial<Pick<Todo, "done" | "value">>): Promise<Todo> {
    const db = await this.getDb();
    const todo = await this.get(id);
    if (!args) Promise.resolve(todo);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(todoStore.name, "readwrite");
      transaction.onerror = reject;

      const store = transaction.objectStore(todoStore.name);

      const newTodo = {
        ...todo,
        ...args,
        updatedAt: new Date(),
      };

      const req: IDBRequest = store.put(newTodo);

      req.onsuccess = () => {
        resolve(newTodo);
      };
    });
  }
}

export const TodoDB = new TodoDatabase();

import { openDb } from ".";
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

export const getTodos = async (): Promise<Todo[]> => {
  const db = await openDb();
  console.log("open db");

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
};

const getTodo = async (id: Todo["id"]): Promise<Todo> => {
  const db = await openDb();

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
};

export const changeStatusTodos = async (id: Todo["id"], done: Todo["done"]): Promise<Todo> => {
  const db = await openDb();
  const todo = await getTodo(id);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(todoStore.name, "readwrite");
    transaction.onerror = reject;

    const store = transaction.objectStore(todoStore.name);

    const newTodo = {
      ...todo,
      done,
      updatedAt: new Date(),
    };

    const req: IDBRequest = store.put(newTodo);

    req.onsuccess = () => {
      console.log("success");
      resolve(newTodo);
    };
  });
};

export const addTodo = async (value: string): Promise<Todo> => {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(todoStore.name, "readwrite");
    transaction.onerror = reject;
    const store = transaction.objectStore(todoStore.name);

    const now = new Date();
    const newTodo: Todo = {
      id: uuidv4(),
      value,
      done: false,
      createdAt: now,
      updatedAt: now,
    };

    const req: IDBRequest = store.put(newTodo);

    req.onsuccess = () => {
      resolve(newTodo);
    };
  });
};

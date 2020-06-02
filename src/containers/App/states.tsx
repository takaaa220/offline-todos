import { Fetcher } from "~/helpers/fetcher";
import { Todo, getTodos, addTodo, changeStatusTodos } from "~/db/todo";
import {
  useState,
  useContext,
  createContext,
  useCallback,
  FC,
  SetStateAction,
  Dispatch,
} from "react";

export type AppPage =
  | {
      type: "top";
    }
  | {
      type: "todos";
      todosFetcher: Fetcher<Todo[]>;
    };

export type AppState = {
  page: AppPage;
};

type ContextValue = {
  state: AppState;
  setState: Dispatch<SetStateAction<AppState>>;
};

const initialState = (): AppState => ({
  page: {
    type: "top",
  },
});

const manageAppStates = () => {
  const Context = createContext<ContextValue>({
    state: {
      page: {
        type: "top",
      },
    },
    setState: () => {
      throw new Error("hello worldddd");
    },
  });

  const useAppStates = () => {
    const [state, setState] = useState<AppState>(initialState());

    const Provider = useCallback<FC>(({ children }) => {
      return <Context.Provider value={{ state, setState }}>{children}</Context.Provider>;
    }, []);

    return { state, Provider };
  };

  const useAppActions = () => {
    const { setState } = useContext(Context);

    return {
      goToTodos: () => {
        setState((state) => ({
          ...state,
          page: {
            type: "todos",
            todosFetcher: new Fetcher(getTodos),
          },
        }));
      },
      addTodo: async (value: string) => {
        await addTodo(value);

        setState((state) => ({
          ...state,
          page: {
            type: "todos",
            todosFetcher: new Fetcher(getTodos),
          },
        }));
      },
      changeStatusTodo: async (id: string, done: boolean) => {
        await changeStatusTodos(id, done);

        setState((state) => ({
          ...state,
          page: {
            type: "todos",
            todosFetcher: new Fetcher(getTodos),
          },
        }));
      },
    };
  };

  return { useAppStates, useAppActions };
};

export const { useAppStates, useAppActions } = manageAppStates();

import { Fetcher } from "~/helpers/fetcher";
import { Todo, getTodos, addTodo, changeStatusTodos } from "~/db/todo";
import {
  useState,
  useContext,
  createContext,
  useCallback,
  FC,
  useTransition,
  TransitionStartFunction,
} from "react";
import { TRANSITION_CONFIG } from "~/constants";

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

type UpdateFunction = (updater: (prev: AppState) => AppState, transition?: boolean) => void;

type ContextValue = {
  state: AppState;
  setState: UpdateFunction;
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
    const [startTransition, isPending] = useTransition(TRANSITION_CONFIG);

    const handleChange = useCallback<UpdateFunction>(
      (updater, transition = false) => {
        if (transition) {
          startTransition(() => {
            setState(updater);
          });
        } else {
          setState(updater);
        }
      },
      [setState, startTransition],
    );

    const Provider = useCallback<FC>(({ children }) => {
      return (
        <Context.Provider value={{ state, setState: handleChange }}>{children}</Context.Provider>
      );
    }, []);

    return { state, Provider, isPending };
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
      addTodo: async (value: string, startTransition: TransitionStartFunction) => {
        const todosFetcher = new Fetcher(async () => {
          await addTodo(value);

          return getTodos();
        });

        startTransition(() => {
          setState((state) => ({
            ...state,
            page: {
              type: "todos",
              todosFetcher,
            },
          }));
        });
      },
      changeStatusTodo: async ({
        id,
        done,
        startTransition,
      }: {
        id: string;
        done: boolean;
        startTransition: TransitionStartFunction;
      }) => {
        const todosFetcher = new Fetcher(async () => {
          await changeStatusTodos(id, done);

          return getTodos();
        });

        startTransition(() => {
          setState((state) => {
            return {
              ...state,
              page: {
                type: "todos",
                todosFetcher,
              },
            };
          });
        });
      },
    };
  };

  return { useAppStates, useAppActions };
};

export const { useAppStates, useAppActions } = manageAppStates();

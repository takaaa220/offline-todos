import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
} from "react";

type StateUpdater<State> = (state: State) => State;
type SetStateFunction<State> = (updater: StateUpdater<State>, transition?: boolean) => void;

interface GenerateStateManagementToolsOptions<State, I, Actions> {
  getInitialState: (option: I) => State;
  getActions: (setState: SetStateFunction<State>, option: I) => Actions;
}

type ManagedState<State> = [State, FC, boolean];
type UseManagedState<State, I> = undefined extends I
  ? (options?: I) => ManagedState<State>
  : (options: I) => ManagedState<State>;

interface StateManagementTools<State, I, Actions> {
  useManagedState: UseManagedState<State, I>;
  useActions: () => Actions;
}

/**
 * Generate hooks for state management.
 */
export function generateStateManagenentTools<State, I, Actions>({
  getInitialState,
  getActions,
}: GenerateStateManagementToolsOptions<State, I, Actions>): StateManagementTools<
  State,
  I,
  Actions
> {
  type ContextValue = {
    setState: SetStateFunction<State>;
    actions: Actions;
  };
  const Context = createContext<ContextValue>({
    setState: () => {
      throw new Error("hello world");
    },
    actions: (undefined as unknown) as Actions,
  });

  const useManagedState = ((initArg: I) => {
    const [state, setState] = useState<State>(() => getInitialState(initArg));
    const [startTransition, isPending] = useTransition({
      timeoutMs: 10000,
    });
    const handleSetState = useCallback<SetStateFunction<State>>(
      (state, transition) => {
        if (transition) {
          startTransition(() => {
            setState(state);
          });
        } else {
          setState(state);
        }
      },
      [setState],
    );

    const contextValue = useMemo<ContextValue>(() => {
      const actions = getActions(handleSetState, initArg);
      return {
        setState: handleSetState,
        actions,
      };
    }, []);

    const Provider = useCallback<FC>(
      ({ children }) => <Context.Provider value={contextValue}>{children}</Context.Provider>,
      [setState, isPending],
    );

    return [state, Provider, isPending];
  }) as UseManagedState<State, I>;

  const useActions = () => {
    const { actions } = useContext(Context);
    return actions;
  };

  return {
    useManagedState,
    useActions,
  };
}

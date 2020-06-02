import React, { FC, useEffect } from "react";
import { useThemeMode } from "~/components/ThemeProvider";
import { useAppStates } from "./states";
import { TopPage } from "../Top";
import { TodosPage } from "../Todos";

export const App: FC = () => {
  const { setMode } = useThemeMode();
  const { state, Provider } = useAppStates();

  useEffect(() => {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 19;

    setMode(isNight ? "dark" : "light");
  }, []);

  return (
    <Provider>
      <main>
        {state.page.type === "top" && <TopPage />}
        {state.page.type === "todos" && <TodosPage todosFetcher={state.page.todosFetcher} />}
      </main>
    </Provider>
  );
};

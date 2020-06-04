import React, { FC, useEffect, Suspense } from "react";
import { useThemeMode } from "~/components/ThemeProvider";
import { useAppStates } from "./states";
import { TopPage } from "../Top";
import { TodosPage } from "../Todos";
import { FixedLoader } from "~/components/Loader";

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
      <Suspense fallback={<FixedLoader />}>
        <main>
          {state.page.type === "top" && <TopPage />}
          {state.page.type === "todos" && <TodosPage todosFetcher={state.page.todosFetcher} />}
        </main>
      </Suspense>
    </Provider>
  );
};

import React, { FC, useEffect } from "react";
import { css } from "@emotion/core";
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
      <div css={wrapper}>hello world</div>
      {state.page.type === "top" && <TopPage />}
      {state.page.type === "todos" && <TodosPage todosFetcher={state.page.todosFetcher} />}
    </Provider>
  );
};

const wrapper = (theme: Theme) => css`
  color: ${theme.primary};
  width: 100%;
`;

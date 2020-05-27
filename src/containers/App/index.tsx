import React, { FC, useEffect } from "react";
import { css } from "@emotion/core";
import { useThemeMode } from "~/components/ThemeProvider";

export const App: FC = () => {
  const { setMode } = useThemeMode();

  useEffect(() => {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 19;

    setMode(isNight ? "dark" : "light");
  }, []);

  return <div css={wrapper}>hello world</div>;
};

const wrapper = (theme: Theme) => css`
  color: ${theme.primary};
  width: 100%;
`;

import React, { FC, createContext, useState, useContext } from "react";
import { useTheme as useThemeOrigin, ThemeProvider as ThemeProviderOrigin } from "emotion-theming";
import { darkTheme, lightTheme } from "~/styles/themes";

type Mode = "light" | "dark";

type ModeContextType = {
  mode: "light" | "dark";
  setMode: (mode: Mode) => void;
};

const ModeContext = createContext<ModeContextType>({
  mode: "light",
  setMode: () => {
    throw new Error("hello world");
  },
});

export const ModeProvider: FC = ({ children }) => {
  const [mode, setMode] = useState<Mode>("light");
  const theme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProviderOrigin<Theme> theme={theme}>
      <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>
    </ThemeProviderOrigin>
  );
};

export const useThemeMode = () => useContext(ModeContext);

export const useTheme = () => useThemeOrigin<Theme>();

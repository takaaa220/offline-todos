import React, { FC } from "react";
import ReactDOM from "react-dom";
import { App } from "./containers/App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Global } from "@emotion/core";
import { globalStyle } from "./styles/global";
import { ModeProvider } from "./components/ThemeProvider";

const Alert: FC = ({ children }) => {
  if (window.indexedDB) return <>{children}</>;

  return <p>このブラウザーではこのアプリケーションを使うことができません．．．</p>;
};

const BootStrap = () => (
  <ErrorBoundary>
    <ModeProvider>
      <Global styles={globalStyle} />
      <Alert>
        <App />
      </Alert>
    </ModeProvider>
  </ErrorBoundary>
);

const rootElement = document.getElementById("root") as Element;
ReactDOM.createRoot(rootElement).render(<BootStrap />);

import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { App } from "./containers/App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Global } from "@emotion/core";
import { globalStyle } from "./styles/global";
import { ModeProvider } from "./components/ThemeProvider";
import { PageLoader } from "./components/Loader";

const BootStrap = () => (
  <ErrorBoundary>
    <ModeProvider>
      <Suspense fallback={<PageLoader />}>
        <Global styles={globalStyle} />
        <App />
      </Suspense>
    </ModeProvider>
  </ErrorBoundary>
);

const rootElement = document.getElementById("root") as Element;
ReactDOM.createRoot(rootElement).render(<BootStrap />);

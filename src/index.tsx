import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Global } from "@emotion/core";
import { App } from "./containers/App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { globalStyle } from "./styles/global";
import { ModeProvider } from "./components/ThemeProvider";
import { PageLoader } from "./components/Loader";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").then(
      (registration) => {
        console.log("ServiceWorker registration successful!");
        console.table(registration);
      },
      (error) => {
        console.log("ServiceWorker registration failed. ", error);
      },
    );
  });
}

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

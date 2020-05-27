import React from "react";
import ReactDOM from "react-dom";
import { App } from "./containers/App";

const BootStrap = () => <App />;

const rootElement = document.getElementById("root") as Element;
ReactDOM.createRoot(rootElement).render(<BootStrap />);

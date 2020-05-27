import React from "react";
import ReactDOM from "react-dom";

const BootStrap = () => <div>hello world</div>;

const rootElement = document.getElementById("root") as Element;
ReactDOM.createRoot(rootElement).render(<BootStrap />);

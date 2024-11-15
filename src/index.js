import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode> removed to avoid double rendering and breaking the "hasUnsavedChanges" state
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

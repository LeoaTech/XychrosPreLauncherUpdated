import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./contexts/ContextProvider";
import { ThemeProvider } from "./contexts/ThemeContext";

ReactDOM.render(
  // Wrap the app inside the Context provider
  <ThemeProvider>
    <ContextProvider>
      <App />
    </ContextProvider>
  </ThemeProvider>,
  document.getElementById("app")
);

import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./contexts/ContextProvider";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.render(
  // Wrap the app inside the Context provider
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <ThemeProvider>
        <ContextProvider>
          <App />
        </ContextProvider>
      </ThemeProvider>
    </Provider>
  </QueryClientProvider>,
  document.getElementById("app")
);

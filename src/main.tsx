import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { LanguageProvider } from "./context/LanguageContext.tsx";
import { CurrencyProvider } from "./context/CurrencyContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <CurrencyProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </CurrencyProvider>
    </LanguageProvider>
  </StrictMode>
);

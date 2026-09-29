import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { FoodProvider } from "./context/FoodContext";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FoodProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </FoodProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
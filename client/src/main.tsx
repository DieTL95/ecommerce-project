import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import "./index.css";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { CartProvider, useCart } from "./context/cart-context";
import LoadingPage from "./components/UI/LoadingPage";
// Create a new router instance
const router = createRouter({
  routeTree,
  context: { auth: undefined!, cartContext: undefined! },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const auth = useAuth();
  const cartContext = useCart();
  if (auth.isLoading) {
    return <LoadingPage />;
  }
  return <RouterProvider router={router} context={{ auth, cartContext }} />;
};

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </StrictMode>,
  );
}

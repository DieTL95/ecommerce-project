import CartComponent from "@/components/Cart/CartComponent";
import Footer from "@/components/Footer";
import NavBarComponent from "@/components/NavBar/NavBarComponent";
import SearchComponent from "@/components/NavBar/SearchComponent";
import UserNavBarComponent from "@/components/NavBar/UserNavBarComp";
import type { useAuth } from "@/context/auth-context";
import { type useCart } from "@/context/cart-context";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "react-hot-toast";

const RootLayout = () => (
  <>
    <HeadContent />
    <div className=" w-full flex justify-center flex-col">
      <div className="p-2 flex gap-2 items-center justify-center ">
        <div className="md:max-w-[70vw] w-full justify-between flex flex-col gap-4 my-4">
          <div className="flex flex-row w-full gap-4 justify-between items-center">
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>
            <SearchComponent />
            <div className="flex flex-row gap-6">
              <Link to="/cart" className="[&.active]:font-bold">
                <CartComponent />
              </Link>
              <UserNavBarComponent />
            </div>
          </div>
          <NavBarComponent />
        </div>
      </div>
      <hr />
      <Outlet />
      <Footer />
    </div>
    <Toaster
      position="bottom-right"
      toastOptions={{
        error: {
          style: { background: "var(--color-rose-800)" },
          iconTheme: { primary: "var(--color-rose-500)", secondary: "black" },
        },
        success: {
          style: { background: "black", color: "white" },
          iconTheme: { primary: "white", secondary: "black" },
        },
      }}
    />
    <TanStackRouterDevtools />
  </>
);

interface RootContext {
  auth: ReturnType<typeof useAuth>;
  cartContext: ReturnType<typeof useCart>;
}

export const Route = createRootRouteWithContext<RootContext>()({
  component: RootLayout,
});

import MainWrapper from "@/components/UI/MainWrapper";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  component: RouteComponent,
  beforeLoad: ({ context: { auth } }) => {
    if (!auth.isAuthenticated) {
      redirect({
        to: "/",
        throw: true,
      });
    }
  },
  head: () => ({
    meta: [
      { name: "description", content: "Manage your account." },
      { title: "Account | " },
    ],
  }),
});

function RouteComponent() {
  return (
    <MainWrapper>
      <div className="w-full flex justify-center items-center gap-2 my-4">
        <div className="h-full flex-1/6 border-r border-black">
          <ul className="w-full h-full flex-col flex items-start justify-start gap-10">
            <li>
              <Link to="/account/orders" className="[&.active]:font-bold">
                Orders
              </Link>
            </li>
            <li>
              <Link to="/account/address-book" className="[&.active]:font-bold">
                Addresses
              </Link>
            </li>
            <li>
              <Link to={"."}>Manage Staff</Link>
            </li>
            <li>
              <Link to={"."}>Frontpage</Link>
            </li>
          </ul>
        </div>
        <div className="w-full h-full flex-5/6 flex justify-start items-center">
          <Outlet />
        </div>
      </div>
    </MainWrapper>
  );
}

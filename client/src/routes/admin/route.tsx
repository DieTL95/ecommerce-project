import MainWrapper from "@/components/UI/MainWrapper";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminLayoutComponent,
  beforeLoad: ({ context: { auth } }) => {
    if (!auth.user?.admin) {
      redirect({
        to: "/",
        throw: true,
      });
    }
  },
  head: () => ({
    meta: [
      { name: "Admin panel", content: "Administration tools." },
      { title: "Admin | " },
    ],
  }),
});

function AdminLayoutComponent() {
  return (
    <MainWrapper>
      <div className="w-full flex justify-center items-center gap-2 my-4">
        <div className="h-full flex-1/6 border-r border-black">
          <ul className="w-full h-full flex-col flex items-start justify-center gap-10">
            <li>
              <Link to="/admin/products" className="[&.active]:font-bold">
                Products List
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="[&.active]:font-bold">
                Categories List
              </Link>
            </li>
            <li>
              <Link
                to="/admin/frontpage"
                activeOptions={{ exact: true }}
                className="[&.active]:font-bold"
              >
                Manage Frontpage
              </Link>
            </li>
            <li>
              <Link to="/admin/add-product" className="[&.active]:font-bold">
                Add Product
              </Link>
            </li>
            <li>
              <Link to="/admin/add-category" className="[&.active]:font-bold">
                Add Category
              </Link>
            </li>
            <li>
              <Link
                to="/admin/frontpage/new-frontpage"
                className="[&.active]:font-bold"
              >
                New Frontpage
              </Link>
            </li>
            <li>
              <Link to={"/"}>Frontpage</Link>
            </li>
            <li>
              <Link to={"/"}>Something else</Link>
            </li>
          </ul>
        </div>
        <div className="w-full h-full flex-5/6 flex justify-center items-center">
          <Outlet />
        </div>
      </div>
    </MainWrapper>
  );
}

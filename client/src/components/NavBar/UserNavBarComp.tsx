import { useEffect, useRef, useState } from "react";
import { UserIcon } from "../Icons";
import { Link, useRouteContext } from "@tanstack/react-router";

const UserNavBarComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userIconRef = useRef<HTMLDivElement>(null);
  const {
    auth: { logout, isAuthenticated, user },
  } = useRouteContext({ from: "__root__" });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const menu = menuRef.current;
      const userIcon = userIconRef.current;
      if (!menu?.contains(target) && !userIcon?.contains(target)) {
        setMenuOpen(false);
      }

      if (menu?.contains(target) && target.tagName === "A") {
        setTimeout(() => {
          setMenuOpen(false);
        }, 500);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [menuRef]);

  return (
    <div className="relative flex flex-col justify-center items-center">
      <div
        ref={userIconRef}
        className="cursor-pointer"
        onClick={() => {
          setMenuOpen(!menuOpen);
        }}
      >
        <UserIcon />
      </div>
      {menuOpen && (
        <div className="absolute top-8  w-52 z-50">
          <div
            className="bg-black flex flex-col rounded-xl justify-center items-center gap-y-4 py-2 *:hover:border-b"
            ref={menuRef}
          >
            {isAuthenticated ? (
              <>
                <Link to="/account/orders" className="[&.active]:font-bold">
                  Orders
                </Link>
                <Link
                  to="/account/address-book"
                  className="[&.active]:font-bold"
                >
                  Adresses
                </Link>
                <Link
                  to="/account"
                  activeOptions={{ exact: true }}
                  className="[&.active]:font-bold"
                >
                  Account
                </Link>
                {user?.admin && <Link to="/admin">Admin</Link>}
                <Link to="." onClick={logout}>
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="[&.active]:font-bold">
                  Login
                </Link>
                <Link to="/auth/register" className="[&.active]:font-bold">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNavBarComponent;

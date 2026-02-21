import { useAuth } from "@/context/auth-context";
import { Link } from "@tanstack/react-router";

const AuthComponent = () => {
  const { isAuthenticated, logout } = useAuth();

  console.log(isAuthenticated);
  return !isAuthenticated ? (
    <>
      <Link to="/auth/login" className="[&.active]:font-bold">
        Login
      </Link>
      <Link to="/auth/register" className="[&.active]:font-bold">
        Register
      </Link>
    </>
  ) : (
    <a href="#" onClick={logout} className="[&.active]:font-bold">
      Logout
    </a>
  );
};

export default AuthComponent;

import { Link } from "@tanstack/react-router";

const NavBarComponent = () => {
  return (
    <nav className=" w-full gap-24 justify-center flex">
      <Link to="/products" className="[&.active]:font-bold">
        Womens
      </Link>
      <Link to="/products" className="[&.active]:font-bold">
        Mens
      </Link>
      <Link to="/products" className="[&.active]:font-bold">
        Shoes
      </Link>
      <Link to="/products" className="[&.active]:font-bold">
        All
      </Link>
    </nav>
  );
};

export default NavBarComponent;

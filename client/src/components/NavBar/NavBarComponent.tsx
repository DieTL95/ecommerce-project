import { Link } from "@tanstack/react-router";

const NavBarComponent = () => {
  return (
    <nav className=" w-full gap-24 justify-center flex">
      <Link
        to="/$category"
        params={{ category: "88c5f8f7-4bd0-421e-a7eb-56b70680e1a8" }}
        className="[&.active]:font-bold"
      >
        Womens
      </Link>
      <Link
        to="/$category"
        params={{ category: "9c726832-d59c-4200-8721-7e2a0704e8e9" }}
        className="[&.active]:font-bold"
      >
        Mens
      </Link>
      <Link
        to="/$category"
        params={{ category: "5d74a8e9-ade3-4e26-958b-92bc24120541" }}
        className="[&.active]:font-bold"
      >
        Shoes
      </Link>
      <Link to="/products" className="[&.active]:font-bold">
        All
      </Link>
    </nav>
  );
};

export default NavBarComponent;

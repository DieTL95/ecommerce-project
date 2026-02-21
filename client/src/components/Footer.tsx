import { Link } from "@tanstack/react-router";

const Footer = () => {
  return (
    <footer className="p-2 flex gap-2 items-center justify-center bg-black/60">
      <div className="max-w-[70vw] w-full justify-between flex flex-col">
        <div className="w-full mt-4">
          <div className="w-full flex grid-rows-2">
            <div className="w-2/3 flex justify-between">
              <div className="flex flex-col w-full">
                <p className="font-bold">Title</p>
                <Link to="/">Link</Link>
                <Link to="/">Link</Link>
                <Link to="/">Link</Link>
                <Link to="/">Link</Link>
                <Link to="/">Link</Link>
              </div>
              <div className="flex flex-col w-full">
                <p className="font-bold">Title 2</p>
                <Link to="/">Link 2</Link>
                <Link to="/">Link 2</Link>
                <Link to="/">Link 2</Link>
                <Link to="/">Link 2</Link>
                <Link to="/">Link 2</Link>
              </div>
              <div className="flex flex-col w-full">
                <p className="font-bold">Title 3</p>
                <Link to="/">Link 3</Link>
                <Link to="/">Link 3</Link>
                <Link to="/">Link 3</Link>
                <Link to="/">Link 3</Link>
                <Link to="/">Link 3</Link>
              </div>
            </div>
            <div className="w-1/3 flex justify-center">
              <div>Newsletter</div>
            </div>
          </div>
        </div>
        <hr />
        <div className="w-full flex flex-wrap justify-center">
          <Link to="/">Link 3</Link>
          <Link to="/">Link 3</Link>
          <Link to="/">Link 3</Link>
          <Link to="/">Link 3</Link>
          <Link to="/">Link 3</Link>
          <Link to="/">Link 3</Link>
          <Link to="/">Link 3</Link>
          <Link to="/">Link 3</Link>
          <Link to="/">Link 3</Link>
          <Link to="/">Link 3</Link>
          <Link to="/">Link 3</Link>
          <Link to="/">Link 3</Link>
        </div>
        <div className=" w-full flex justify-center">Copyright</div>
      </div>
    </footer>
  );
};

export default Footer;

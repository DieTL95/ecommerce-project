import Spinner from "../Icons/Spinner";

const LoadingPage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black/20">
      <Spinner />
    </div>
  );
};

export default LoadingPage;

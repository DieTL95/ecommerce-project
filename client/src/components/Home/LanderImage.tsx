import lander from "../../assets/images/lander1.jpg";

const LanderImageComponent = () => {
  return (
    <div className="w-full relative  ">
      <div className="w-full max-h-[calc(100vh-41px)] max-w-screen justify-center flex min-h-[300px]">
        <img
          src={lander}
          alt="Lander Image"
          style={{
            objectFit: "cover",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default LanderImageComponent;

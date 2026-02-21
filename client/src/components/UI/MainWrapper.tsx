const MainWrapper = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="p-2 w-full h-full justify-center flex ">
      <div className="max-w-[70vw] w-full flex h-full justify-center flex-col">
        {children}
      </div>
    </div>
  );
};

export default MainWrapper;

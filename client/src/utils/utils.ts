export const dollarsPrice = (cents: number) => {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = (cb: any, delay = 1000) => {
  let timer: ReturnType<typeof setTimeout>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...arg: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...arg);
    }, delay);
  };
};

export const capitalizeFirstLetter = (word: string) => {
  return String(word).charAt(0).toUpperCase() + String(word).slice(1);
};

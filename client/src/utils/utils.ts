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

export const capitaliseTitle = (title: string) => {
  return title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + String(word).slice(1))
    .join(" ");
};
export const truncateTitle = (title: string) => {
  const max = 50;
  return title.length > max ? title.substring(0, max) + "..." : title;
};

export const apiDomain =
  import.meta.env.NODE_ENV === "production"
    ? import.meta.env.VITE_DOMAIN_URL
    : import.meta.env.VITE_DEV_DOMAIN;

export const fetchSignature = async () => {
  try {
    const res = await fetch("http://localhost:5100/api/signed-upload", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log(res);
    if (res.ok) {
      const data: {
        signature: string;
        timestamp: string;
        cloudname: string;
        apikey: string;
      } = await res.json();
      return data;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Fetching signature failed.");
  }
};

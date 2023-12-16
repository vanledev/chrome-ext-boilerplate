const ENDPOINTS = [
  "/mission-control/orders\\?filters", // get list orders
  "prolist/listings/querystats",
];

const { fetch: originFetch } = window;
window.fetch = async (...args) => {
  const res = await originFetch(...args);
  const url = args[0];

  if (url && ENDPOINTS.some((i) => !!url.match(new RegExp(i, "gi")))) {
    res
      .clone()
      .json()
      .then((data) => {
        window.postMessage({ data: data, url });
      })
      .catch((e) => console.log(e?.toString()));
  }

  return res;
};

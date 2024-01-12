// const ENDPOINTS = [
//   "/mission-control/orders\\?filters", // get list orders
//   "prolist/listings/querystats",
//   "prolist/stats/listings",
// ];

const { fetch: originFetch } = window;
window.fetch = async (...args) => {
  const res = await originFetch(...args);
  const url = args[0];
  console.log(res);
  // if (url && ENDPOINTS.some((i) => !!url.match(new RegExp(i, "gi")))) {
  res
    .clone()
    .json()
    .then((data) => {
      window.postMessage({ data: data, url });
    })
    .catch((e) => console.log(e?.toString()));
  // }

  return res;
};

const OriginalWebSocket = window.WebSocket;

const ProxiedWebSocket = function (...args) {
  const ws = new OriginalWebSocket(...args);
  ws.addEventListener("message", function (e) {
    // Only intercept
    console.log("receive websocket message", e);
  });
  return ws;
};

window.WebSocket = ProxiedWebSocket;

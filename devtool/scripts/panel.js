// chrome.devtools.network.onRequestFinished.addListener(function (netevent) {
//    const request = netevent.request;
//    const response = netevent.response;
//    if (
//       !request?.url?.includes("https://www.etsy.com/api/v3/") ||
//       response.status !== 200 ||
//       !response?.content?.mimeType?.includes("application/json")
//    )
//       return;

//    console.log("request: ", request.url);
//    netevent.getContent(function (body) {
//       const orders = JSON.parse(body);
//       console.log("orders: ", orders);
//       chrome.runtime.sendMessage({
//          message: "orderInfos",
//          data: orders,
//       });
//    });
// });

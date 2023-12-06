chrome.runtime.onConnect.addListener(function (port) {
  if (port.name !== "portForEtsyMarketing") return;
  port.onMessage.addListener(async (portData) => {
    if (portData.message == "ads-keywords") {
      sendToContentScript("ads-keywords", portData.data);
    }
  });
});

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log(
//     "Background script of Marketing received request",
//     request,
//     "from sender",
//     sender
//   );
//   if (request.message === "ads-keywords") {
//     sendToContentScript("ads-keywords", request.data);
//   }
// });

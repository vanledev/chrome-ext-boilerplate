chrome.runtime.onConnect.addListener(function (port) {
  if (port.name !== "portForEtsyMarketing") return;
  port.onMessage.addListener(async (portData) => {
    if (portData.message == "ads-keywords") {
      sendToContentScript("ads-keywords", portData.data);
    }
  });
});

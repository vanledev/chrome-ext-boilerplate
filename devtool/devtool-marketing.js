chrome.devtools.panels.create(
  "Etsy Helper",
  "../../assets/images/48.png",
  "devtool/htmls/panel.html",
  function (panel) {
    console.log("Devtool Panel created");
  }
);

let portForEtsyMarketing = chrome.runtime.connect({
  name: "portForEtsyMarketing",
});

portForEtsyMarketing.onDisconnect.addListener(() => {
  console.log("port disconnect");

  portForEtsyMarketing = chrome.runtime.connect({
    name: "portForEtsyMarketing",
  });
});
chrome.devtools.network.onRequestFinished.addListener(onConnectHandler);

async function onConnectHandler(netevent) {
  const request = await netevent.request;
  const response = await netevent.response;
  if (
    !request?.url?.includes("prolist/listings/querystats") ||
    response.status !== 200 ||
    !response?.content?.mimeType?.includes("application/json")
  )
    return;

  netevent.getContent(function (body) {
    const data = JSON.parse(body);
    portForEtsyMarketing.postMessage({
      message: "ads-keywords",
      data,
    });
  });
}

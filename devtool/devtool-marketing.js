chrome.devtools.panels.create(
  "Etsy Helper",
  "../../assets/images/48.png",
  "devtool/htmls/panel.html",
  function (panel) {
    console.log("i'm devtool");
  }
);

//Created a port with background page for continous message communication
var portForEtsyMarketing = chrome.runtime.connect({
  name: "portForEtsyMarketing",
});
// capture response request get orders
chrome.devtools.network.onRequestFinished.addListener(async function (
  netevent
) {
  const request = await netevent.request;
  const response = await netevent.response;
  if (
    !request?.url?.includes("prolist/listings/querystats") ||
    response.status !== 200 ||
    !response?.content?.mimeType?.includes("application/json")
  )
    return;

  // send response to background
  netevent.getContent(function (body) {
    const data = JSON.parse(body);

    portForEtsyMarketing.postMessage({
      message: "ads-keywords",
      data,
    });

    // chrome.runtime.sendMessage({
    //   message: "ads-keywords",
    //   data,
    // });
  });
});

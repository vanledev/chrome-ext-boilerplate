chrome.runtime.onConnect.addListener(function (port) {
  if (port.name == "portForEtsyMarketing") {
    port.onMessage.addListener(async (portData) => {
      if (portData.message == "ads-keywords") {
        const [tab] = await chrome.tabs.query({ active: true });

        chrome.tabs.sendMessage(tab.id, {
          message: "ads-keywords",
          data: portData.data,
        });
      }
    });
  }
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tab.status == "complete" &&
    tab.url?.includes("your/shops/me/advertising/listings")
  ) {
    chrome.tabs.sendMessage(tab.id, {
      message: "ads-add-to-dom",
      data: null,
    });
  }
});

function executeScriptOnTabCompleted(tabId) {
  chrome.scripting.executeScript({
    target: { tabId },
    function: function () {
      // This function will be executed in the context of the webpage
      console.log("Execute Script from background script");
    },
  });
}

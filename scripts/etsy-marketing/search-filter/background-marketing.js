chrome.runtime.onConnect.addListener(function (port) {
  if (port.name == "portForEtsyMarketing") {
    port.onMessage.addListener(async (portData) => {
      if (portData.message == "ads-keywords") {
        chrome.storage.local.set({
          adsKeywords: portData.data,
        });
        // const [tab] = await chrome.tabs.query({ active: true });
        // await sleep(5000);
        // chrome.tabs.sendMessage(tab.id, {
        //   message: "ads-keywords",
        //   data: portData.data,
        // });
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
      message: "tab-update-complete",
      data: null,
    });

    chrome.storage.local.get(["adsKeywords"], (obj) => {
      console.log(obj);
      chrome.tabs.sendMessage(tab.id, {
        message: "ads-keywords",
        data: obj.adsKeywords,
      });
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

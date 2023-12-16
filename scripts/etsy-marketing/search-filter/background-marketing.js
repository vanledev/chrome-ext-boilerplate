let adsKeywords;
chrome.runtime.onMessage.addListener(
  ({ message, data }, sender, sendResponse) => {
    switch (message) {
      case "ads-keyword":
        console.log("background receive", data);
        adsKeywords = data;
        break;
      case "getAdsKeywords":
        if (adsKeywords) {
          console.log("adsKeyword global variable in bg script", adsKeywords);
          const data = adsKeywords;
          adsKeywords = null;
          console.log("adsKeywords after set null", adsKeywords);
          sendResponse(data);
        } else {
          console.log("no ads keywords var");
          sendResponse(false);
        }
        break;
    }
  }
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tab.status == "complete" &&
    tab.url?.includes("your/shops/me/advertising/listings")
  ) {
    chrome.tabs.sendMessage(tab.id, {
      message: "tab-update-complete",
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

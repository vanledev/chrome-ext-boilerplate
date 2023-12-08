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
    console.log(tab);
    chrome.tabs.sendMessage(tabId, { message: "ads-add-to-dom", data: null });
    console.log("send message ");
    // executeOnTabCompleted(tabId);
  }
});

function executeOnTabCompleted(tabId) {
  chrome.scripting.executeScript({
    target: { tabId },
    function: function () {
      // This function will be executed in the context of the webpage
      console.log("Execute Script from background script");
    },
  });
}

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  if (details.frameId === 0) {
    // Fires only when details.url === currentTab.url
    chrome.tabs.get(details.tabId, function (tab) {
      if (tab.url === details.url) {
        console.log("onHistoryStateUpdated");
      }
    });
  }
});

chrome.webNavigation.onCommitted.addListener(function (details) {
  if (details.frameId === 0 && details.transitionType === "reload") {
    console.log("Page reloaded:", details.url);
    // Additional code for handling page reload event
  }
});

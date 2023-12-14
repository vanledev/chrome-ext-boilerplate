chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "setLocalStorage") {
    chrome.storage.local.set(request.data, function () {
      sendResponse({ message: "Data set in local storage" });
    });

    return true;
  } else if (request.action === "getLocalStorage") {
    chrome.storage.local.get([request.metricName], function (result) {
      let data = {};
      data[request.metricName] = result[request.metricName]
        ? result[request.metricName]
        : 0;
      sendResponse({ data });
    });

    return true;
  }
});

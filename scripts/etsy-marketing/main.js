chrome.runtime.onMessage.addListener(runtimeOnMessage);

async function runtimeOnMessage(request, sender, sendResponse) {
  switch (request.message) {
    case "tab-update-complete":
      // inject();
      console.log("content script receive message tab-update-complete");
      const res = await handleKeywordData();
      if (res) {
        addSearchFilterToDOM();
        addMetricToDom();
      }
  }
}

window.addEventListener("message", async function (event) {
  // Your event handling logic goes here

  const { data } = event.data || {};

  console.log("window on message receive data", data);
  if (data?.queryStats) {
    const res = await handleKeywordData(data);
    if (res) {
      const metrics = await getMetrics();
      updateInvidualMetricsToDOM(metrics);
    }
  }
});

async function handleKeywordData(data) {
  // update global variable keywordsDataRaw
  if (!data) {
    keywordsDataRaw = await retryFunctionWithDelay(checkKeywordData, 10, 2000);
    console.log("keyword data from local storage", keywordsDataRaw);
  } else {
    keywordsDataRaw = data;
  }

  if (keywordsDataRaw) {
    allKeywords = keywordsDataRaw.queryStats.map(
      (keywordData) => keywordData.stemmedQuery
    );

    enabledKeywords = keywordsDataRaw.queryStats
      .filter((keyword) => keyword.isRelevant === true)
      .map((keywordData) => keywordData.stemmedQuery);
    disabledKeywords = keywordsDataRaw.queryStats
      .filter((keyword) => keyword.isRelevant === false)
      .map((keywordData) => keywordData.stemmedQuery);
    currentKeywordsPool = getCurrentKeywordsPool();

    updateFuse();
    return true;
  } else {
    return false;
  }
}

async function checkKeywordData() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ message: "getAdsKeywords" }, (response) => {
      console.log("response getAdsKeywords from background script", response);
      if (response) {
        resolve(response);
      } else {
        resolve(false);
      }
    });
  });
}

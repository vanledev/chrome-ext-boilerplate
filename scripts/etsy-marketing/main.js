chrome.runtime.onMessage.addListener(runtimeOnMessage);
async function runtimeOnMessage(request, sender, sendResponse) {
  switch (request.message) {
    case "tab-update-complete":
      console.log("content script receive message tab-update-complete");
      const res = await handleKeywordData();
      if (res) {
        addSearchFilterToDOM();
        addMetricToDom();
      }
  }
}

async function handleKeywordData() {
  // update global variable keywordsDataRaw
  keywordsDataRaw = await retryFunctionWithDelay(checkKeywordData, 10, 2000);
  console.log("keyword data from local storage", keywordsDataRaw);
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

// let executed_ads_keywords = false;
// let executed_ads_add_to_dom = false;

chrome.runtime.onMessage.addListener(runtimeOnMessage);
function runtimeOnMessage(request, sender, sendResponse) {
  if (
    request.message == "ads-keywords"
    //  && executed_ads_keywords == false
  ) {
    // executed_ads_keywords = true;
    console.log("Content script receive message ", request);
    sendResponse({ message: "success" });
    keywordsDataRaw = request.data;
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
  } else if (request.message == "ads-add-to-dom") {
    console.log("content script receive message ads-add-to-dom");

    addToDom();
  }
}

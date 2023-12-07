let executed = false;
chrome.runtime.onMessage.addListener(runtimeOnMessage, { once: true });
function runtimeOnMessage(request, sender, sendResponse) {
  if (request.message == "ads-keywords" && executed == false) {
    console.time("Execute runtime On Message Handler");
    executed = true;
    console.log("receive message ", request);
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
    if (!fuse) {
      updateFuse();
    }
    console.timeEnd("Execute runtime On Message Handler");
  }
}

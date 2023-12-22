window.addEventListener("message", async function (event) {
  // Your event handling logic goes here

  const { data } = event.data || {};

  if (data?.queryStats) {
    inject();
    console.log("content script receive keywords from window");
    const res = await handleKeywordData(data);
    if (res) {
      addSearchFilterToDOM();
      addMetricToDom();
    }
  }
});

async function handleKeywordData(data) {
  
    keywordsDataRaw = data;
  
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

 

function updateFuse() {
  const options = {
    threshold: 0,
    ignoreLocation: true,
  };
  const currentKeywordsPool = getCurrentKeywordsPool();

  const newFuse = new Fuse(currentKeywordsPool, options);

  fuse = newFuse;
}
function getCurrentStatus() {
  const chosenStatus = $("#filterDropdown").val();
  return chosenStatus ? chosenStatus : "all";
}
function getCurrentKeywordsPool() {
  const status = getCurrentStatus();

  let keywords;
  if (status == "all") {
    keywords = allKeywords;
  } else if (status == "enabled") {
    keywords = enabledKeywords;
  } else if (status == "disabled") {
    keywords = disabledKeywords;
  }

  return keywords;
}
function updateCurrentKeywordsPool() {
  currentKeywordsPool = getCurrentKeywordsPool();

  updateFuse();
}
function reAssignTableRowsToJqueryElement() {
  tableRows = $(keywordTableSelector + " tbody tr");
}

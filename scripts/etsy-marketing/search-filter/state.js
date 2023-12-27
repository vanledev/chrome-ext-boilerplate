function updateFuse() {
  const options = {
    threshold: 0,
    ignoreLocation: true,
    useExtendedSearch: true,
  };
  const currentKeywordsPool = getCurrentKeywordsPool();

  const newFuse = new Fuse(currentKeywordsPool, options);

  fuse = newFuse;
}
function getCurrentStatus() {
  const chosenStatus = $("#om-keyword-status").val();
  return chosenStatus ? chosenStatus : "all";
}

function getSearchOption() {
  const option = $("#om-search-option").val();
  return option ? option : "contain";
}

function getCurrentKeywordsPool() {
  const status = getCurrentStatus();
  // console.log("status la", status);
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
  // console.log("keyword pool sau khi update", currentKeywordsPool);
  updateFuse();
}

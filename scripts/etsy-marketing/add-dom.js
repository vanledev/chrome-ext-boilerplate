async function main() {
  if (
    window.location.href.includes("etsy.com/your/shops/me/advertising/listings")
  ) {
    await retryFunctionWithDelay(addListenerToButtonWhenReady, 10, 2000);
    reAssignTableRowsToJqueryElement();
  }
}
main();
function addListenerToButtonWhenReady() {
  const button = $("[aria-controls*='wt-content-toggle']")[0];
  if (button) {
    console.log("button", button);
    button.addEventListener(
      "click",
      () => {
        console.log("click");
        retryFunctionWithDelay(addToDomWhenKeywordsReady, 10, 1000);
      },
      { once: true }
    );
    return true;
  } else {
    console.log("no button");
    return false;
  }
}

function addToDomWhenKeywordsReady() {
  if (keywordsDataRaw) {
    addFilterAndSearchNodes();
    return true;
  } else {
    return false;
  }
}
function addFilterAndSearchNodes() {
  const html = `
    <div class="wrap-filter-search">
        <div>
            
        <input id="searchForm">
        <label for="searchForm">Showing <span id="countRows">${keywordsDataRaw.queryStats.length}</span> results</label>
      </div>
      <div class="filter-status-wrap">
        <select id="filterDropdown" >
        <option value="all" selected>All (${keywordsDataRaw.queryStats.length})</option>
          <option value="enabled" >Enabled (${enabledKeywords.length})</option>
  
          <option value="disabled">Disabled (${disabledKeywords.length})</option>
        </select> 
      </div>
  
    
    </div>
    `;
  $(keywordTableSelector).parent().before($(html));

  $("#filterDropdown").on("change", onChangeFilter);

  $("#searchForm").on("input", debounce(onChangeSearchForm, 500));
}

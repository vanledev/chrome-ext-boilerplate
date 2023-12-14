async function addSearchFilterToDOM() {
  if (
    window.location.href.includes("etsy.com/your/shops/me/advertising/listings")
  ) {
    await retryFunctionWithDelay(waitForPlace, 10, 2000);
  }
}

async function waitForPlace() {
  const place = $('p:contains("Search terms and orders for this ad")')[0];
  if (place) {
    await retryFunctionWithDelay(waitForKeywords, 10, 1000);
    return true;
  } else {
    console.log("no button");
    return false;
  }
}

async function waitForKeywords() {
  if (keywordsDataRaw) {
    addFilterAndSearchNodes();
    console.log("done adding filter and search to dom");
    return true;
  } else {
    console.log("no data keywords yet");
    return false;
  }
}
function addFilterAndSearchNodes() {
  const html = `
    <div class="wrap-filter-search">

        <div class="flex">
                  <div class="om-search om-select-style">
                    <select id="om-search-option" >
                      <option value="contain" selected>Contain </option>
                      <option value="exclude" > Exclude  </option>        
                    </select> 
                  </div>

                  <div>
                    <input class="om-input" id="searchForm">
                  
                  </div>
                  <label for="searchForm">Showing <span id="countRows">${keywordsDataRaw.queryStats.length}</span> results</label>
        </div> 
    

 

    <div class="om-select-style">
        <select id="om-keyword-status" >
        <option value="all" selected>All (${keywordsDataRaw.queryStats.length})</option>
          <option value="enabled" >Enabled (${enabledKeywords.length})</option>
          <option value="disabled">Disabled (${disabledKeywords.length})</option>
        </select> 
    </div>
  
    
  </div>
    `;
  $('p:contains("Search terms and orders for this ad")')
    .parent()
    .before($(html));

  $("#om-keyword-status").on("change", onChangeFilter);
  $("#om-keyword-status").on("change", changeKeywordResult);

  $("#searchForm").on("input", debounce(changeKeywordResult, 500));
  $("#om-search-option").on("change", changeKeywordResult);
  removeDoubleEle(".wrap-filter-search");
}

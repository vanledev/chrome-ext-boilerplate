async function addToDom() {
  if (
    window.location.href.includes("etsy.com/your/shops/me/advertising/listings")
  ) {
    await retryFunctionWithDelay(waitForPlace, 10, 2000);
  }
}

async function waitForPlace() {
  const place = $('p:contains("Search terms and orders for this ad")')[0];
  if (place) {
    // console.log("button", button);
    // button.addEventListener("click", () => {
    //   console.log("click");
    //   if (!$("#filterDropdown")[0]) {
    //     retryFunctionWithDelay(waitForKeywords, 10, 1000);
    //   }
    // });

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
  $('p:contains("Search terms and orders for this ad")')
    .parent()
    .before($(html));

  $("#filterDropdown").on("change", onChangeFilter);

  $("#searchForm").on("input", debounce(onChangeSearchForm, 500));
  if ($(".wrap-filter-search").length > 1) {
    for (let i = 1; i < $(".wrap-filter-search").length; i++) {
      $($(".wrap-filter-search")[i]).remove();
    }
  }

  // content.js
}

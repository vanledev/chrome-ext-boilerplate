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
  $(keywordTableSelector).prepend(`
  <div id="om-table-loading" class="hide-loading">
    <img src="${chrome.runtime.getURL("assets/images/loading.gif")}"></img>
  </div>
  `);
  const html = `

    <div class="wrap-filter-search">

        <div class="flex">
                  <div class="om-search om-select-style">
                    <select id="om-search-option" >
                      <option value="contain" selected>Contain </option>
                      <option value="exclude" > Exclude  </option>        
                    </select> 
                  </div>

                  <div class="om-input-container">
                    <input class="om-input" id="searchForm">
                    <span class="close-icon close-icon-for-text">

                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='100' height='100' viewBox='0 0 64 64'%3E%3Cpath d='M32,10c12.15,0,22,9.85,22,22s-9.85,22-22,22s-22-9.85-22-22S19.85,10,32,10z M36.95,39.778	c0.781,0.781,2.047,0.781,2.828,0c0.781-0.781,0.781-2.047,0-2.828c-0.175-0.175-2.767-2.767-4.95-4.95	c2.183-2.183,4.774-4.774,4.95-4.95c0.781-0.781,0.781-2.047,0-2.828c-0.781-0.781-2.047-0.781-2.828,0	c-0.175,0.175-2.767,2.767-4.95,4.95c-2.183-2.183-4.775-4.775-4.95-4.95c-0.781-0.781-2.047-0.781-2.828,0	c-0.781,0.781-0.781,2.047,0,2.828c0.175,0.175,2.767,2.767,4.95,4.95c-2.183,2.183-4.774,4.774-4.95,4.95	c-0.781,0.781-0.781,2.047,0,2.828c0.781,0.781,2.047,0.781,2.828,0c0.175-0.175,2.767-2.767,4.95-4.95	C34.183,37.011,36.775,39.603,36.95,39.778z'%3E%3C/path%3E%3C/svg%3E" alt="SVG">
 
                    </span>
                  
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

  $("#searchForm").on("input change", debounce(changeKeywordResult, 500));
  $("#om-search-option").on("change", changeKeywordResult);

  $(".wrap-filter-search" + ":not(:first)").remove();

  $(".close-icon-for-text").on("click", function () {
    $(this).parent().find("input").val("").trigger("input");
  });
}


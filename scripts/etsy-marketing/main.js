// keywordsDataRaw.queryStats =
// {
//   "stemmedQuery": "christmas mug",
//   "clickCount": 7,
//   "impressionCounts": 786,
//   "orderCount": 0,
//   "meetsHighThresholdCtr": true,
//   "meetsHighThresholdOrderRate": false,
//   "isRelevant": true,
// }
let keywordsDataRaw;
let allKeywords;
let enabledKeywords;
let disabledKeywords;
let currentKeywordsPool;
let tableRows;
let fuse;

const keywordTableSelector =
  ".wt-grid > .wt-grid__item-xs-12:last-child > div:nth-child(2) .wt-table";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == "ads-keywords") {
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
  }
});

// Wait to the button that show keywords to appear in DOM, then addEventListener to it
onExpandTable();
async function onExpandTable() {
  if (
    window.location.href.includes("etsy.com/your/shops/me/advertising/listings")
  ) {
    await retryFunctionWithDelay(addToDOM, 10, 2000);
    reAssignTableRows();
  }
}

function addToDOM() {
  const button = $("[aria-controls*='wt-content-toggle']")[0];
  console.log(button, keywordsDataRaw);
  if (button && keywordsDataRaw) {
    button.click();
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
function updateFuse() {
  // Configuration options
  const options = {
    threshold: 0, // Adjust the fuzzy search threshold (0 to 1)
  };
  const currentKeywordsPool = getCurrentKeywordsPool();

  // Create a Fuse instance
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
function changeCurrentKeywordsPool() {
  currentKeywordsPool = getCurrentKeywordsPool();

  updateFuse();

  console.log("change current keyword pool to", currentKeywordsPool);
}

function reAssignTableRows() {
  tableRows = $(keywordTableSelector + " tbody tr");
  console.log("jquery table rows updated");
}

function resetSearchForm() {
  $("#searchForm").val("");
}

function updateTable(keywordsShouldShow) {
  $("#countRows").html(keywordsShouldShow.length);
  tableRows.each(function () {
    const keywordInRow = $(this)
      .find("th")
      .contents()
      .filter(function () {
        return this.nodeType === 3; // Filter out non-text nodes
      })
      .text()
      .trim()
      .slice(1, -1);
    $(this).toggle(keywordsShouldShow.includes(keywordInRow));
  });
}

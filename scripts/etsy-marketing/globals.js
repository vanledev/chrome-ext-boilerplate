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
      fuse = initSearchObject();
    }
  }
});

// Wait to the button that show keywords to appear in DOM, then addEventListener to it
addListenerToButton();
async function addListenerToButton() {
  if (
    window.location.href.includes("etsy.com/your/shops/me/advertising/listings")
  ) {
    await retryFunctionWithDelay(addToDOM, 10, 1000);
    reAssignTableRows();
  }
}

function addToDOM() {
  const button = $("[aria-controls*='wt-content-toggle']")[0];

  if (button) {
    button.addEventListener(
      "click",
      () => {
        const html = `<div class="filter-status-wrap">
            <select id="filterDropdown" >
            <option value="all" selected>All (${keywordsDataRaw.queryStats.length})</option>
              <option value="enabled" >Enabled (${enabledKeywords.length})</option>
          
              <option value="disabled">Disabled (${disabledKeywords.length})</option>
            </select> </div>
            `;
        $(keywordTableSelector).parent().before($(html));
        const html2 = `<input id="searchForm">`;
        $(keywordTableSelector).parent().before($(html2));

        $("#filterDropdown").on("change", () => {
          changeCurrentKeywordsPool();
          filterKeywords();
          // reAssignTableRows(); khiến mỗi lần click chọn Enabled and Disabled lại ko cập nhật được nữa
        });

        $("#searchForm").on("input", debounce(search, 500));
      },
      { once: true }
    );

    return true;
  } else {
    return false;
  }
}

function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

async function retryFunctionWithDelay(childFunction, count, delay) {
  let attempts = 0;

  while (true) {
    console.log(attempts);
    const res = childFunction();
    if (res == true || attempts > count) break;
    attempts++;
    await sleep(delay);
  }
  console.log("Done retry function");
  return true;
}
function initSearchObject() {
  // Configuration options
  const options = {
    threshold: 0, // Adjust the fuzzy search threshold (0 to 1)
  };
  const currentKeywordsPool = getCurrentKeywordsPool();
  console.log("current keywords ", currentKeywordsPool);
  // Create a Fuse instance
  const fuse = new Fuse(currentKeywordsPool, options);
  console.log("init search object");
  return fuse;
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
  let currentKeywordsPool = new Set(keywords);
  return currentKeywordsPool;
}
function changeCurrentKeywordsPool() {
  currentKeywordsPool = getCurrentKeywordsPool();
  console.log("change current keyword pool");
}

function reAssignTableRows() {
  tableRows = $(keywordTableSelector + " tbody tr");
  console.log("jquery table rows updated", tableRows);
}

window.addEventListener("message", async function (event) {
  // Your event handling logic goes here
  console.log("window receiv message", event);
  const { data, url } = event.data || {};

  if (url?.includes("prolist/listings/querystats")) {
    whenHaveKeywords(data);
  } else if (url?.includes("prolist/stats/listings")) {
    owner_id = data.listing.listingImages[0].ownerId;
    listing_id = data.listing.listingId;
  }
});

async function whenHaveKeywords(data) {
  console.log("content script receive keywords from window");
  console.log("keywordsDataRaw", keywordsDataRaw);
  keywordsDataRaw = data;
  console.log("keywordsDataRaw", keywordsDataRaw);
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
  await addNewTable();

  fillTable();
  addSearchFilterToDOM();
  addMetricToDom();
}
async function fillTable() {
  console.log("fill table");
  for (let keyword of keywordsDataRaw.queryStats) {
    $("#new-table tbody").append(`
      <tr>
        <td data-index-td="">
          ${keyword.stemmedQuery}
        </td>
        <td data-index-td="">
        ${keyword.impressionCounts}
      </td>
      <td data-index-td="">
      ${keyword.clickCount}
    </td>
    <td data-index-td="">
    ${keyword.meetsHighThresholdCtr}
  </td>
  <td data-index-td="">
  
</td>
<td data-index-td="">
 
</td>
<td data-index-td="">
${keyword.orderCount}
</td>
<td data-index-td="">
 ${keyword.meetsHighThresholdOrderRate}
</td>
<td data-index-td="">
 
</td>
<td>

    <input type="checkbox" value=${keyword.isRelevant} ${
      keyword.isRelevant ? "checked" : ""
    }/>
<td>
      </tr>
      `);
  }
}

async function addNewTable() {
  const place = await waitForElement("#impressions_wt_tab_panel", 10, 1000);
  if (!place) {
    console.error("Cant find place to insert table");
    return;
  }
  console.log("place for add table", place);
  $(`<table id="new-table"><thead> </thead><tbody></tbody><table>`).insertAfter(
    place.parent()
  );

  const headerTextArray = [
    "Buyers searched for",
    "Views",
    "Clicks",
    "",
    "Click Rate",
    "Spend",
    "Orders",
    "",
    "POAS",
    "Relevant",
  ];
  const tableHead = $("#new-table thead");
  const newRow = $("<tr class='injected-tr'>");

  // Loop through the header text array and create <th> elements
  headerTextArray.forEach(function (text) {
    const newHeader = $("<th class='wt-table__head__cell wt-no-wrap'>").html(
      text + '<span class="injected-icon"></span> '
    );
    newRow.append(newHeader);
  });

  tableHead.append(newRow);
}

window.addEventListener("message", async function (event) {
  // Your event handling logic goes here
  console.log("window receiv message", event);
  const { data, url } = event.data || {};

  if (url?.includes("prolist/listings/querystats")) {
    await whenHaveKeywords(data);
  } else if (url?.includes("prolist/stats/listings")) {
    owner_id = data.listing.listingImages[0].ownerId;
    listing_id = data.listing.listingId;

    views = data.totalStats.impressionCount;
    orders = data.totalStats.conversions;
    clicks = data.totalStats.clickCount;

    revenue = data.totalStats.revenue / 100;
    spend = data.totalStats.spentTotal / 100;
    addMetricToDom();
  }
});

async function whenHaveKeywords(data) {
  console.log("content script receive keywords from window");

  fullDataToFillTable = data.queryStats;

  allKeywords = fullDataToFillTable;

  enabledKeywords = fullDataToFillTable.filter(
    (keyword) => keyword.isRelevant === true
  );

  disabledKeywords = fullDataToFillTable.filter(
    (keyword) => keyword.isRelevant === false
  );

  await addNewTable();

  fillTable(fullDataToFillTable);

  addFilterAndSearchNodes();
}
async function fillTable(data) {
  console.log("fill table");
  $("#new-table tbody").empty();
  for (let keyword of data) {
    $("#new-table tbody").append(`
      <tr>
        <td data-name="stemmedQuery">
          ${keyword.stemmedQuery}
        </td>
        <td data-name="">
        ${keyword.impressionCounts}
      </td>
      <td data-name="">
      ${keyword.clickCount}
    </td>
    <td data-name="">
    ${keyword.meetsHighThresholdCtr ? high : ""}
  </td>
  <td  data-id='om-individual-metric-click-rate'>
  ${
    keyword.clicksRate !== undefined && keyword.clicksRate !== null
      ? (keyword.clicksRate * 100).toFixed(2).toString()
      : ""
  }
</td>
<td   data-id='om-individual-metric-spend'>
 ${keyword.spend?.toFixed(2) || ""}
</td>
<td data-name="">
${keyword.orderCount}
</td>
<td data-name="">
 ${keyword.meetsHighThresholdOrderRate ? high : ""}
</td>
<td data-name="" data-id='om-individual-metric-poas'>
 ${keyword.poas?.toFixed(2) || ""}
</td>
<td>

    <input type="checkbox" value=${keyword.isRelevant} ${
      keyword.isRelevant ? "checked" : ""
    }/>
<td>
      </tr>
      `);
  }

  $('#new-table tbody input[type="checkbox"]').on("change", onCheckbox);
}

async function addNewTable() {
  const place = await waitForElement("#impressions_wt_tab_panel", 10, 1000);
  if (!place) {
    console.error("Cant find place to insert table");
    return;
  }
  console.log("place for add table", place);
  $(
    `<section id="om-section"><div class="new-table-container"><table id="new-table"><thead> </thead><tbody></tbody><table></div></section>`
  ).insertAfter(place.parent());

  const headerTextArray = [
    { variable_name: "buyers_searched_for", text: "Buyers searched for" },
    { variable_name: "impressionCounts", text: "Views" },
    { variable_name: "clickCount", text: "Clicks" },
    { variable_name: "", text: "" },
    { variable_name: "clicksRate", text: "Click Rate" },
    { variable_name: "spend", text: "Spend" },
    { variable_name: "orderCount", text: "Orders" },
    { variable_name: "", text: "" },
    { variable_name: "poas", text: "POAS" },
    { variable_name: "isRelevant", text: "Relevant" },
  ];

  const tableHead = $("#new-table thead");
  const newRow = $("<tr class='injected-tr'>");

  // Loop through the header text array and create <th> elements
  headerTextArray.forEach(function (item) {
    const newHeader = $("<th class='wt-table__head__cell wt-no-wrap'>")
      .attr("data-name", item.variable_name)
      .html(
        `<span id="col-name">` +
          item.text +
          '</span> <span class="injected-icon"></span> '
      );
    newRow.append(newHeader);
  });

  tableHead.append(newRow);

  makeTableSortable();
}

function makeTableSortable() {
  $("#new-table thead th").on("click", async function () {
    if ([0, 3, 7, 9].includes($(this).index())) {
      return;
    }

    // showNoti();
    const thIndex = $(this).index();

    $("#new-table thead th").each(function (index) {
      // Check if the index is different from 4
      if (index !== thIndex) {
        // Set the HTML content of the current TH element to empty
        $(this).find(".injected-icon").html("");
      }
    });
    this.desc = !this.desc;
    if (!this.desc) {
      $(this).find(".injected-icon").text("⬆");
    } else {
      $(this).find(".injected-icon").text("⬇");
    }
    sortBy = [$(this).attr("data-name"), this.desc];
    console.log("sortBy", sortBy);
    handleChange();
  });
}

async function onCheckbox() {
  const old_value = JSON.parse($(this).attr("value"));

  $(this).attr("value", !old_value);
  const tr = $(this).parent().parent();
  const trkeyword = tr.find('td[data-name="stemmedQuery"]').text().trim();

  const res = await fetchToEtsy(trkeyword, !old_value);
  console.log(res);
  if (res.status == 201) {
    $("#wt-toast-feed")
      .html(
        writeSuccessText(
          `${trkeyword} has been ${old_value ? "turned off" : "turned on"}`
        )
      )
      .show();
  } else {
  }

  setTimeout(function () {
    $("#wt-toast-feed").hide();
  }, 2000);
}

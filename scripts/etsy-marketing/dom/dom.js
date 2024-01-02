async function addMetricToDom() {
  if (
    window.location.href.includes("etsy.com/your/shops/me/advertising/listings")
  ) {
    await addMetrics();
  }
}

async function addMetrics() {
  // Select the desired div
  const placeForGeneralMetrics = $(
    ".wt-tab[aria-label*='Interactive graph with Etsy Ads']"
  );

  placeForGeneralMetrics.append(`
  <div class="om-metric-input">
      <div>
        <label for="metric-basecost" class="wt-text-caption-title ">Basecost:</label>
      
      
        <div class="om-input-container">
          <input value=0 class="om-input om-input-manual-metric" type="text" data-variable-name="basecost" id="metric-basecost" name="metric-basecost">
          <span class="close-icon  close-icon-for-number">

           <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='100' height='100' viewBox='0 0 64 64'%3E%3Cpath d='M32,10c12.15,0,22,9.85,22,22s-9.85,22-22,22s-22-9.85-22-22S19.85,10,32,10z M36.95,39.778	c0.781,0.781,2.047,0.781,2.828,0c0.781-0.781,0.781-2.047,0-2.828c-0.175-0.175-2.767-2.767-4.95-4.95	c2.183-2.183,4.774-4.774,4.95-4.95c0.781-0.781,0.781-2.047,0-2.828c-0.781-0.781-2.047-0.781-2.828,0	c-0.175,0.175-2.767,2.767-4.95,4.95c-2.183-2.183-4.775-4.775-4.95-4.95c-0.781-0.781-2.047-0.781-2.828,0	c-0.781,0.781-0.781,2.047,0,2.828c0.175,0.175,2.767,2.767,4.95,4.95c-2.183,2.183-4.774,4.774-4.95,4.95	c-0.781,0.781-0.781,2.047,0,2.828c0.781,0.781,2.047,0.781,2.828,0c0.175-0.175,2.767-2.767,4.95-4.95	C34.183,37.011,36.775,39.603,36.95,39.778z'%3E%3C/path%3E%3C/svg%3E" alt="SVG">

          </span>
      
      </div>
      
      
        </div>
    
      <div>
        <label class="wt-text-caption-title" for="metric-shipping">Shipping:</label>
        

        <div class="om-input-container">
        <input value=0  class="om-input om-input-manual-metric" type="text" data-variable-name="shipping" id="metric-shipping" name="metric-shipping"> 
          <span class="close-icon close-icon-for-number">

           <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='100' height='100' viewBox='0 0 64 64'%3E%3Cpath d='M32,10c12.15,0,22,9.85,22,22s-9.85,22-22,22s-22-9.85-22-22S19.85,10,32,10z M36.95,39.778	c0.781,0.781,2.047,0.781,2.828,0c0.781-0.781,0.781-2.047,0-2.828c-0.175-0.175-2.767-2.767-4.95-4.95	c2.183-2.183,4.774-4.774,4.95-4.95c0.781-0.781,0.781-2.047,0-2.828c-0.781-0.781-2.047-0.781-2.828,0	c-0.175,0.175-2.767,2.767-4.95,4.95c-2.183-2.183-4.775-4.775-4.95-4.95c-0.781-0.781-2.047-0.781-2.828,0	c-0.781,0.781-0.781,2.047,0,2.828c0.175,0.175,2.767,2.767,4.95,4.95c-2.183,2.183-4.774,4.774-4.95,4.95	c-0.781,0.781-0.781,2.047,0,2.828c0.781,0.781,2.047,0.781,2.828,0c0.175-0.175,2.767-2.767,4.95-4.95	C34.183,37.011,36.775,39.603,36.95,39.778z'%3E%3C/path%3E%3C/svg%3E" alt="SVG">

          </span>
      
      </div>

    </div>
    </div>
      `);
  removeDoubleEle(".om-metric-input");
  $(".om-input-manual-metric").on(
    "input",
    debounce(onInputBasecostShipping, 500)
  );

  $(".close-icon-for-number").on("click", function () {
    $(this).parent().find("input").val(0).trigger("input");
  });
  // add general metrics
  $('<div class="om-general-metrics"></div>').insertAfter(
    placeForGeneralMetrics
  );
  removeDoubleEle(".om-general-metrics");

  const metrics = await getMetrics();
  await updateDOMGeneralMetrics(metrics);

  await updateInvidualMetricsToDOM(metrics);
}

async function onInputBasecostShipping(event) {
  const metrics = await getMetrics();
  updateDOMGeneralMetrics(metrics);
  updateInvidualMetricsToDOM(metrics);
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

                  <div class="om-input-container">
                    <input class="om-input" id="searchForm">
                    <span class="close-icon close-icon-for-text">

                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='100' height='100' viewBox='0 0 64 64'%3E%3Cpath d='M32,10c12.15,0,22,9.85,22,22s-9.85,22-22,22s-22-9.85-22-22S19.85,10,32,10z M36.95,39.778	c0.781,0.781,2.047,0.781,2.828,0c0.781-0.781,0.781-2.047,0-2.828c-0.175-0.175-2.767-2.767-4.95-4.95	c2.183-2.183,4.774-4.774,4.95-4.95c0.781-0.781,0.781-2.047,0-2.828c-0.781-0.781-2.047-0.781-2.828,0	c-0.175,0.175-2.767,2.767-4.95,4.95c-2.183-2.183-4.775-4.775-4.95-4.95c-0.781-0.781-2.047-0.781-2.828,0	c-0.781,0.781-0.781,2.047,0,2.828c0.175,0.175,2.767,2.767,4.95,4.95c-2.183,2.183-4.774,4.774-4.95,4.95	c-0.781,0.781-0.781,2.047,0,2.828c0.781,0.781,2.047,0.781,2.828,0c0.175-0.175,2.767-2.767,4.95-4.95	C34.183,37.011,36.775,39.603,36.95,39.778z'%3E%3C/path%3E%3C/svg%3E" alt="SVG">
 
                    </span>
                  
                  </div>
                  <label for="searchForm">Showing <span id="countRows">${fullDataToFillTable.length}</span> results</label>
        </div> 
    

 

    <div class="om-select-style">
        <select id="om-keyword-status" >
        <option value="all" selected>All (${fullDataToFillTable.length})</option>
          <option value="enabled" >Enabled (${enabledKeywords.length})</option>
          <option value="disabled">Disabled (${disabledKeywords.length})</option>
        </select> 
    </div>
  
    
  </div>
    `;

  $("#om-section").prepend(html);

  $("#om-keyword-status").on("change", handleChange);

  $("#searchForm").on("input change", debounce(handleChange, 500));
  $("#om-search-option").on("change", handleChange);

  // $(".wrap-filter-search" + ":not(:first)").remove();

  $(".close-icon-for-text").on("click", function () {
    $(this).parent().find("input").val("").trigger("input");
  });
}
async function handleChange() {
  const data = await getNewfullDataToFillTable();
  console.log("new data to fill table", data);
  fillTable(data);
}
async function getNewfullDataToFillTable() {
  let data = fullDataToFillTable;
  let searchText = $("#searchForm").val();
  if (searchText) {
    const newFuse = new Fuse(data, {
      keys: ["stemmedQuery"],
      threshold: 0,
      ignoreLocation: true,
      useExtendedSearch: true,
    });
    const containOrExclude = $("#om-search-option").val()
      ? $("#om-search-option").val()
      : "contain";
    switch (containOrExclude) {
      case "contain":
        data = newFuse.search(searchText).map((word) => word.item);

        break;
      case "exclude":
        data = newFuse.search("!" + searchText).map((word) => word.item);
        break;
    }
  }

  const onOrOff = $("#om-keyword-status").val()
    ? $("#om-keyword-status").val()
    : "all";

  switch (onOrOff) {
    case "all":
      data = data;
      break;
    case "enabled":
      data = data.filter((keyword) => keyword.isRelevant == true);
      break;
    case "disabled":
      data = data.filter((keyword) => keyword.isRelevant == false);
      break;
  }

  data = [...data].sort((a, b) =>
    sortBy[1] ? b[sortBy[0]] - a[sortBy[0]] : a[sortBy[0]] - b[sortBy[0]]
  );

  $("#countRows").text(data.length);
  return data;
}

async function updateInvidualMetricsToDOM(metrics) {
  let tr = await waitForElement("#new-table tbody tr");
  await insertMetricsToGlobalTableData(metrics);
  if (tr) {
    fillTable(fullDataToFillTable);
  }
  async function insertMetricsToGlobalTableData(metrics) {
    const basecost = parseFloat(await getManualMetric("basecost"));
    const shipping = parseFloat(await getManualMetric("shipping"));
    fullDataToFillTable = fullDataToFillTable.map((keyword) => {
      keyword.clicksRate = keyword.clickCount / keyword.impressionCounts;
      keyword.spend = keyword.clickCount * metrics.cpc.metricValue;
      if (
        keyword.clickCount == 0 ||
        metrics.cpc.metricValue == 0 ||
        typeof metrics.aov.metricValue !== "number" ||
        typeof metrics.eFeePerOrder.metricValue !== "number"
      ) {
        keyword.poas = 0;
      } else {
        keyword.poas =
          (keyword.orderCount *
            (metrics.aov.metricValue -
              basecost -
              metrics.eFeePerOrder.metricValue +
              shipping)) /
          (keyword.clickCount * metrics.cpc.metricValue);
      }

      return keyword;
    });
  }
}

async function updateDOMGeneralMetrics(metrics) {
  $(".om-general-metrics").empty();
  for (let metric of Object.values(metrics)) {
    $(".om-general-metrics").append(returnMetricHTML(metric));
  }
}

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

  const rowsToLoad = 10;
  const tableBody = $("#new-table tbody");
  const container = $(".new-table-container");

  function appendRows(startIndex, endIndex) {
    for (var i = startIndex; i < endIndex; i++) {
      if (data[i]) {
        const newRow = $(
          `
                    <tr>
                      <td data-name="stemmedQuery">
                        ${data[i].stemmedQuery}
                      </td>
                      <td data-name="">
                      ${data[i].impressionCounts}
                    </td>
                    <td data-name="">
                    ${data[i].clickCount}
                  </td>
                  <td data-name="">
                  ${data[i].meetsHighThresholdCtr ? high : ""}
                </td>
                <td  data-id='om-individual-metric-click-rate'>
                ${
                  data[i].clicksRate !== undefined &&
                  data[i].clicksRate !== null
                    ? (data[i].clicksRate * 100).toFixed(2).toString()
                    : ""
                }
              </td>
              <td   data-id='om-individual-metric-spend'>
              ${data[i].spend?.toFixed(2) || ""}
              </td>
              <td data-name="">
              ${data[i].orderCount}
              </td>
              <td data-name="">
              ${data[i].meetsHighThresholdOrderRate ? high : ""}
              </td>
              <td data-name="" data-id='om-individual-metric-poas'>
              ${data[i].poas?.toFixed(2) || ""}
              </td>
              <td>
              
                  <input type="checkbox" value=${data[i].isRelevant} ${
            data[i].isRelevant ? "checked" : ""
          }/>
              <td>
                    </tr>
          `
        );
        tableBody.append(newRow);
      }
    }
    $('#new-table tbody input[type="checkbox"]').on("change", onCheckbox);
  }

  appendRows(0, rowsToLoad);

  var currentIndex = rowsToLoad;

  container.scroll(
    debounce(function () {
      if (
        container.scrollTop() + container.height() >=
        container[0].scrollHeight - 50
      ) {
        console.log("load more rows");

        var endIndex = currentIndex + rowsToLoad;
        console.log("currentIndex, endIndex", currentIndex, endIndex);
        appendRows(currentIndex, endIndex);
        currentIndex = endIndex;
      }
    })
  );
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

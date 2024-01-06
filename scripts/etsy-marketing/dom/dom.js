async function addMetricToDom() {
  if (
    window.location.href.includes("etsy.com/your/shops/me/advertising/listings")
  ) {
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
    $(".om-input-manual-metric").on("input", debounce(updateMetrics, 500));

    $(".close-icon-for-number").on("click", function () {
      $(this).parent().find("input").val(0).trigger("input");
    });
    // add general metrics
    $('<div class="om-general-metrics"></div>').insertAfter(
      placeForGeneralMetrics
    );
    removeDoubleEle(".om-general-metrics");

    updateMetrics();

    async function updateMetrics() {
      const metrics = await getMetrics();
      updateDOMGeneralMetrics(metrics);

      updateInvidualMetricsToDOM(metrics);
      async function updateInvidualMetricsToDOM(metrics) {
        let tr = await waitForElement("#new-table tbody tr");
        await insertMetricsToGlobalTableData(metrics);
        if (tr) {
          await updateDataAndFillTable();
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
    }
  }
}

async function updateDataAndFillTable() {
  const data = await getNewfullDataToFillTable();

  fillTable(data);

  async function fillTable(data) {
    console.log("fill table");
    $("#new-table tbody").empty();

    const rowsToLoad = 10;
    const tableBody = $("#new-table tbody");
    const container = $(".new-table-container");
    container.scrollTop(0);
    function appendRows(startIndex, endIndex) {
      for (var i = startIndex; i < endIndex; i++) {
        if (data[i]) {
          const tr = $(
            `
                    <tr>
                    <td>
              <input type="checkbox"  />
            </td>
                      <td class="td-wide" data-name="stemmedQuery">
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
              <input class="wt-switch wt-switch--small" type="checkbox" value=${
                data[i].isRelevant
              } ${data[i].isRelevant ? "checked" : ""}/>
              <label  class="wt-switch__toggle"></label>
       
              <td>
                    </tr>
          `
          );
          tableBody.append(tr);
        }
      }
      $(".wt-switch__toggle").off("click");
      $(".wt-switch__toggle").on("click", onCheckbox);
    }
    async function onCheckbox() {
      const tr = $(this).parent().parent();
      const input = $(this).parent().find("input");
      input.addClass("wt-switch--is-loading");
      const old_value = JSON.parse(input.attr("value"));

      input.attr("value", !old_value);

      const trkeyword = tr.find('td[data-name="stemmedQuery"]').text().trim();

      const res = await fetchToEtsy(trkeyword, !old_value);

      console.log(res);
      if (res) {
        input.removeClass("wt-switch--is-loading");
      }
      if (res.status == 201) {
        $("#wt-toast-feed")
          .html(
            writeSuccessText(
              `${trkeyword} has been ${old_value ? "turned off" : "turned on"}`
            )
          )
          .show();

        fullDataToFillTable.find(
          (x) => x.stemmedQuery == trkeyword
        ).isRelevant = !old_value;
        // updateDataAndFillTable();
        input.prop("checked", !old_value);
      } else {
        $("#wt-toast-feed")
          .html(
            writeSuccessText(
              `Error ${res.status}, ${res.statusText}, ${trkeyword} can't be ${
                old_value ? "turned off" : "turned on"
              }.  `
            )
          )
          .show();
      }

      setTimeout(function () {
        $("#wt-toast-feed").hide();
      }, 2000);
    }

    appendRows(0, rowsToLoad);

    var currentIndex = rowsToLoad;
    container.off();
    container.scroll(
      debounce(function () {
        if (
          container.scrollTop() + container.height() >=
          container[0].scrollHeight - 120
        ) {
          console.log("load more rows");

          var endIndex = currentIndex + rowsToLoad;
          console.log("currentIndex, endIndex", currentIndex, endIndex);
          appendRows(currentIndex, endIndex);
          currentIndex = endIndex;
        }
      }, 50)
    );
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

    $("#countAll").text("All (" + fullDataToFillTable.length + ")");

    $("#countEnabled").text(
      "On (" +
        fullDataToFillTable.filter((keyword) => keyword.isRelevant === true)
          .length +
        ")"
    );
    $("#countDisabled").text(
      "Off (" +
        fullDataToFillTable.filter((keyword) => keyword.isRelevant === false)
          .length +
        ")"
    );
    $("#countRows").text(data.length);
    return data;
  }
}

async function addDOMEle() {
  await addNewTable();
  addFilterAndSearchNodes();
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
          <option  id="countAll" value="all" selected></option>
            <option id="countEnabled" value="enabled" ></option>
            <option id="countDisabled" value="disabled"></option>
          </select> 
      </div>
    
      
    </div>
      `;

    $("#om-section").prepend(html);

    $("#om-keyword-status").on("change", updateDataAndFillTable);

    $("#searchForm").on("input change", debounce(updateDataAndFillTable, 500));
    $("#om-search-option").on("change", updateDataAndFillTable);

    // $(".wrap-filter-search" + ":not(:first)").remove();

    $(".close-icon-for-text").on("click", function () {
      $(this).parent().find("input").val("").trigger("input");
    });
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
    const tr = $(`<tr class='injected-tr'>
  
    <td>
     <input type="checkbox" id="check-all"/>
    
    </td>
    </tr>`);

    // Loop through the header text array and create <th> elements
    headerTextArray.forEach(function (item) {
      const newHeader = $("<th class='wt-table__head__cell wt-no-wrap'>")
        .attr("data-name", item.variable_name)
        .html(
          `<span id="col-name">` +
            item.text +
            '</span> <span class="injected-icon"></span> '
        );
      tr.append(newHeader);
    });

    tableHead.append(tr);

    $("#new-table thead th").on("click", async function () {
      if (
        ![
          "clickCount",
          "impressionCounts",
          "clicksRate",
          "spend",
          "orderCount",
          "poas",
        ].includes($(this).attr("data-name"))
      ) {
        return;
      }

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
      updateDataAndFillTable();
    });
  }
}

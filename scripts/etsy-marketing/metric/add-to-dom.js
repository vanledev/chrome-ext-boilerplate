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
    debounce(onInputBasecostShipping, 1200)
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
function replaceThead() {
  main();

  async function main() {
    const res = await retryFunctionWithDelay(waitForTable, 10, 2000);
    if (res) {
      replaceTh();
      makeTableSortable();
    }
  }

  async function waitForTable() {
    const table = $(keywordTableSelector);
    if (table.length == 0) {
      return false;
    } else {
      return true;
    }
  }
  function replaceTh() {
    $(keywordTableSelector).addClass("keyword-table");
    $(keywordTableSelector + " tbody th").removeClass();
    $(keywordTableSelector + " tbody td").removeClass();

    $(`<table class="injected-table"><thead> </thead></table>`).insertBefore(
      keywordTableSelector
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
    const tableHead = $(".injected-table thead");
    const newRow = $("<tr class='injected-tr'>");

    // Loop through the header text array and create <th> elements
    headerTextArray.forEach(function (text) {
      const newHeader = $("<th class='wt-table__head__cell wt-no-wrap'>").html(
        text + '<span class="injected-icon"></span> '
      );
      newRow.append(newHeader);
    });

    tableHead.append(newRow);
    console.log("thead moi add vao", $(".injected-table"));
    $(".injected-table:not(:last)").remove();
  }

  function makeTableSortable() {
    $(".injected-table thead th").click(function () {
      if ([0, 3, 7, 9].includes($(this).index())) {
        return;
      }

      const thIndex = $(this).index();

      $(".injected-table thead th").each(function (index) {
        // Check if the index is different from 4
        if (index !== thIndex) {
          // Set the HTML content of the current TH element to empty
          $(this).find(".injected-icon").html("");
        }
      });

      var rows = $(keywordTableSelector)
        .find("tr:gt(0)")
        .toArray()
        .sort(comparer($(this).index()));

      this.asc = !this.asc;
      if (!this.asc) {
        rows = rows.reverse();
        $(this).find(".injected-icon").text("⬆");
      } else {
        $(this).find(".injected-icon").text("⬇");
      }
      $(keywordTableSelector).find("tbody").empty();
      for (var i = 0; i < rows.length; i++) {
        $(keywordTableSelector).append(rows[i]);
      }
    });

    function comparer(index) {
      // column index
      return function (a, b) {
        var valA = getCellValue(a, index);
        var valB = getCellValue(b, index);

        return valB - valA;
      };
    }

    function getCellValue(row, index) {
      const val = $($(row).children()[index])
        .text()
        .match(/[+-]?\d+(\.\d+)?/);

      return parseFloat(val);
    }
  }
}

async function onInputBasecostShipping(event) {
  const metrics = await getMetrics();
  updateDOMGeneralMetrics(metrics);
  updateInvidualMetricsToDOM(metrics);
}

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

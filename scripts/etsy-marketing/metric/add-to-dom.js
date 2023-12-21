async function addMetricToDom() {
  if (
    window.location.href.includes("etsy.com/your/shops/me/advertising/listings")
  ) {
    await sleep(2000);
    await addMetrics();
  }
}

async function addMetrics() {
  const metrics = await getMetrics();
  // Select the desired div
  const placeForGeneralMetrics = $(
    ".wt-tab[aria-label*='Interactive graph with Etsy Ads']"
  );
  const basecost = parseFloat(await getManualMetric("basecost"));
  const shipping = parseFloat(await getManualMetric("shipping"));

  // add metrics input
  placeForGeneralMetrics.append(`
  <div class="om-metric-input">
      <div>
        <label for="metric-basecost" class="wt-text-caption-title ">Basecost:</label>
      
      
        <div class="om-input-container">
          <input value=${basecost} class="om-input om-input-manual-metric" type="text" data-variable-name="basecost" id="metric-basecost" name="metric-basecost">
          <span class="close-icon  close-icon-for-number">

           <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='100' height='100' viewBox='0 0 64 64'%3E%3Cpath d='M32,10c12.15,0,22,9.85,22,22s-9.85,22-22,22s-22-9.85-22-22S19.85,10,32,10z M36.95,39.778	c0.781,0.781,2.047,0.781,2.828,0c0.781-0.781,0.781-2.047,0-2.828c-0.175-0.175-2.767-2.767-4.95-4.95	c2.183-2.183,4.774-4.774,4.95-4.95c0.781-0.781,0.781-2.047,0-2.828c-0.781-0.781-2.047-0.781-2.828,0	c-0.175,0.175-2.767,2.767-4.95,4.95c-2.183-2.183-4.775-4.775-4.95-4.95c-0.781-0.781-2.047-0.781-2.828,0	c-0.781,0.781-0.781,2.047,0,2.828c0.175,0.175,2.767,2.767,4.95,4.95c-2.183,2.183-4.774,4.774-4.95,4.95	c-0.781,0.781-0.781,2.047,0,2.828c0.781,0.781,2.047,0.781,2.828,0c0.175-0.175,2.767-2.767,4.95-4.95	C34.183,37.011,36.775,39.603,36.95,39.778z'%3E%3C/path%3E%3C/svg%3E" alt="SVG">

          </span>
      
      </div>
      
      
        </div>
    
      <div>
        <label class="wt-text-caption-title" for="metric-shipping">Shipping:</label>
        

        <div class="om-input-container">
        <input value=${shipping}  class="om-input om-input-manual-metric" type="text" data-variable-name="shipping" id="metric-shipping" name="metric-shipping"> 
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
  updateDOMGeneralMetrics(metrics);

  // add individual metrics for keywords
  addTd();
  addNewColHead();
  updateInvidualMetricsToDOM(metrics);
}
function addNewColHead() {
  const ordersColumn = $(
    keywordTableSelector + '  thead th:has(button:contains("Order"))'
  );

  const releCol = $(
    keywordTableSelector + '  thead th:has(button:contains("Relevant keyword"))'
  );

  const clicksRateCol = $(
    `<th class="col-head-clickRate wt-table__head__cell wt-text-left-xs wt-text-right-lg wt-no-wrap wt-pr-xs-0 wt-mr-xs-0" scope="col"><button class=" sadx-clickable">Clicks Rate</button></th>`
  );

  const poasCol = $(
    `<th class="col-head-poas wt-table__head__cell wt-text-left-xs wt-text-right-lg wt-no-wrap wt-pr-xs-0 wt-mr-xs-0" scope="col"><button class=" sadx-clickable"> POAS®</button></th>`
  );
  const spendCol = $(
    `<th class="col-head-spend wt-table__head__cell wt-text-left-xs wt-text-right-lg wt-no-wrap wt-pr-xs-0 wt-mr-xs-0" scope="col"><button class="sadx-clickable "> Spend</button></th>`
  );
  clicksRateCol.insertBefore(ordersColumn);

  poasCol.insertBefore(releCol);
  spendCol.insertAfter(clicksRateCol);
  removeDoubleEle(".col-head-poas");
  removeDoubleEle(".col-head-clickRate");
}

async function onInputBasecostShipping(event) {
  console.log("will set manual metric");

  await setManualMetric(event);
  const metrics = await getMetrics();
  updateDOMGeneralMetrics(metrics);
  updateInvidualMetricsToDOM(metrics);
}

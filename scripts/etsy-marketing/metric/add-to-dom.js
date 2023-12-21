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
        <input value=${basecost} class="om-input om-input-manual-metric" type="text" data-variable-name="basecost" id="metric-basecost" name="metric-basecost">
      </div>
    
      <div>
        <label class="wt-text-caption-title" for="metric-shipping">Shipping:</label>
        <input value=${shipping}  class="om-input om-input-manual-metric" type="text" data-variable-name="shipping" id="metric-shipping" name="metric-shipping">
    </div>
    </div>
      `);
  removeDoubleEle(".om-metric-input");
  $(".om-input-manual-metric").on(
    "input",
    debounce(onInputBasecostShipping, 1200)
  );

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

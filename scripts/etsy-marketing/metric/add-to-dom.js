async function addMetricToDom() {
  if (
    window.location.href.includes("etsy.com/your/shops/me/advertising/listings")
  ) {
    addNewColHead();
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
  updateInvidualMetricsToDOM(metrics);
}
function addNewColHead() {
  const clickColumn = $(
    keywordTableSelector + '  thead th:has(button:contains("Click"))'
  );

  const clicksRateCol = $(
    `<th class="wt-table__head__cell wt-text-left-xs wt-text-right-lg wt-no-wrap wt-pr-xs-0 wt-mr-xs-0" scope="col"><button class="sadx-clickable">Clicks Rate</button></th>`
  );

  clicksRateCol.insertAfter(clickColumn.next());

  const ordersColumn = $(
    keywordTableSelector + '  thead th:has(button:contains("Order"))'
  );

  const poasCol = $(
    `<th class="wt-table__head__cell wt-text-left-xs wt-text-right-lg wt-no-wrap wt-pr-xs-0 wt-mr-xs-0" scope="col"><button class="sadx-clickable"> POAS®</button></th>`
  );

  poasCol.insertAfter(ordersColumn.next());
}

async function onInputBasecostShipping(event) {
  console.log("will set manual metric");

  await setManualMetric(event);
  const metrics = await getMetrics();
  updateDOMGeneralMetrics(metrics);
  updateInvidualMetricsToDOM(metrics);
}

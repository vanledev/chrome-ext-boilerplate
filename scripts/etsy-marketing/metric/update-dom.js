function addTd() {
  $(keywordTableSelector + " tbody tr").each(function () {
    $(
      `<td data-id="om-individual-metric-click-rate" class=" wt-table__row__cell wt-pr-lg-3 wt-text-left-xs wt-text-right-lg wt-pl-xs-2 wt-pl-lg-0"></td>
      <td data-id="om-individual-metric-spend" class=" wt-table__row__cell wt-pr-lg-3 wt-text-left-xs wt-text-right-lg wt-pl-xs-2 wt-pl-lg-0"></td>
      `
    ).insertAfter($(this).find('td:contains("Clicks")').next());
    $(
      `<td data-id="om-individual-metric-poas" class=" wt-table__row__cell wt-pr-lg-3 wt-text-left-xs wt-text-right-lg wt-pl-xs-2 wt-pl-lg-0"></td>
      `
    ).insertAfter($(this).find('td:contains("Orders")').next());

    $(this)
      .find("[data-id='om-individual-metric-click-rate']" + ":not(:last)")
      .remove();
    $(this)
      .find("[data-id='om-individual-metric-spend']" + ":not(:last)")
      .remove();
    $(this)
      .find("[data-id='om-individual-metric-poas']" + ":not(:last)")
      .remove();
  });
}

async function updateInvidualMetricsToDOM(metrics) {
  // Now 'table' variable contains the reference to the desired table.
  console.log("update indi");
  const basecost = parseFloat(await getManualMetric("basecost"));
  const shipping = parseFloat(await getManualMetric("shipping"));
  let tr = await waitForElement("#new-table tbody tr");
  console.log("tr", $("#new-table tbody tr"));
  await sleep(2000);
  console.log("tr", $("#new-table tbody tr"));
  if (tr) {
    let new_data = dataToFillTable.map((keyword) => {
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
    fillTable(new_data);
  }
}

async function updateDOMGeneralMetrics(metrics) {
  $(".om-general-metrics").empty();
  for (let metric of Object.values(metrics)) {
    $(".om-general-metrics").append(returnMetricHTML(metric));
  }
}

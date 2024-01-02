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

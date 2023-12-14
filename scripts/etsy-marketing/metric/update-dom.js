function addTd() {
  $(keywordTableSelector + " tbody tr").each(function () {
    $(
      `<td class="om-individual-metric-click-rate wt-table__row__cell wt-pr-lg-3 wt-text-left-xs wt-text-right-lg wt-pl-xs-2 wt-pl-lg-0"></td>`
    ).insertAfter($(this).find('td:contains("Clicks")').next());
    $(
      `<td class="om-individual-metric-poas wt-table__row__cell wt-pr-lg-3 wt-text-left-xs wt-text-right-lg wt-pl-xs-2 wt-pl-lg-0"></td>`
    ).insertAfter($(this).find('td:contains("Orders")').next());

    $(this)
      .find(".om-individual-metric-click-rate" + ":not(:last)")
      .remove();
    $(this)
      .find(".om-individual-metric-poas" + ":not(:last)")
      .remove();
  });
}

async function updateInvidualMetricsToDOM(metrics) {
  // Now 'table' variable contains the reference to the desired table.
  const basecost = parseFloat(await getManualMetric("basecost"));
  const shipping = parseFloat(await getManualMetric("shipping"));
  $(keywordTableSelector + " tbody tr").each(function () {
    const views = parseInt(
      $(this).find('td:contains("Views")').text().replace("Views", "").trim()
    );
    const orders = parseInt(
      $(this).find('td:contains("Orders")').text().replace("Orders", "").trim()
    );

    const clicks = parseInt(
      $(this).find('td:contains("Clicks")').text().replace("Clicks", "").trim()
    );
    const clicksRate = clicks / views;
    let poas;
    if (clicks == 0 || metrics.cpc.metricValue == 0) {
      poas = 0;
    } else {
      poas =
        (orders *
          (metrics.aov.metricValue -
            basecost -
            metrics.eFeePerOrder.metricValue +
            shipping)) /
        (clicks * metrics.cpc.metricValue);
    }

    $(this)
      .find(".om-individual-metric-click-rate")
      .text((clicksRate * 100).toFixed(2).toString());

    $(this).find(".om-individual-metric-poas").text(poas.toFixed(2));
  });
}

async function updateDOMGeneralMetrics(metrics) {
  $(".om-general-metrics").empty();
  for (let metric of Object.values(metrics)) {
    $(".om-general-metrics").append(returnMetricHTML(metric));
  }
}

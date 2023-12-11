function addMetricsToDOM() {
  const tabElement = $(
    ".wt-tab[aria-label*='Interactive graph with Etsy Ads']"
  );
  const metrics = getMetrics();
  for (let metric of metrics) {
    tabElement.append(returnMetricHTML(metric));
  }
}

function getMetrics() {
  const views = convertAbbreviatedNumber(
    $("#impressions-tab-content .wt-text-heading").text()
  );

  const clicks = convertAbbreviatedNumber(
    $("#clicks-tab-content  .wt-text-heading").text()
  );
  const orders = convertAbbreviatedNumber(
    $("#conversions-tab-content  .wt-text-heading").text()
  );
  const revenue = convertAbbreviatedNumber(
    $("#revenue-tab-content  .wt-text-heading").text().substring(1)
  );
  const spend = convertAbbreviatedNumber(
    $("#spent-tab-content  .wt-text-heading").text().substring(1)
  );
  const basecost = 10;
  const shipping = 10;
  const clicksRate = (clicks / views) * 100;
  const cr = (orders / clicks) * 100;
  const cpc = (spend / clicks) * 100;
  const cpp = (spend / orders) * 100;
  const aov = (revenue / orders) * 100;
  const eFee = revenue * 0.03 + revenue * 0.065 + orders * (0.2 + 0.35);
  const eFeePerOrder = (eFee / orders) * 100;
  const profit = revenue + shipping * orders - spend - basecost * orders - eFee;
  const expenses = eFee + spend + basecost * orders;
  const roi = (profit / expenses) * 100;
  const poas = (revenue - basecost * orders - eFee + shipping * orders) / spend;

  const clicksRateObj = {
    metricName: "Clicks Rate",
    metricValue: clicksRate,
    symbol: "%",
  };
  const crObj = { metricName: "CR", metricValue: cr, symbol: "%" };
  const cpcObj = { metricName: "CPC", metricValue: cpc, symbol: "$" };
  const cppObj = { metricName: "CPP", metricValue: cpp, symbol: "$" };
  const aovObj = { metricName: "AOV", metricValue: aov, symbol: "$" };
  const basecostObj = { metricName: "Basecost", metricValue: basecost };
  const shippingObj = { metricName: "Shipping", metricValue: shipping };
  const eFeeObj = { metricName: "E-Fee", metricValue: eFee, symbol: "$" };
  const eFeePerOrderObj = {
    metricName: "E-Fee per Order",
    metricValue: eFeePerOrder,
    symbol: "$",
  };
  const profitObj = { metricName: "Profit", metricValue: profit, symbol: "$" };
  const expensesObj = {
    metricName: "Expenses",
    metricValue: expenses,
    symbol: "$",
  };
  const roiObj = { metricName: "ROI", metricValue: roi, symbol: "$" };
  const poasObj = { metricName: "POAS", metricValue: poas, symbol: "$" };

  // Array of metric objects
  const metricObjects = [
    clicksRateObj,
    crObj,
    cpcObj,
    cppObj,
    aovObj,
    basecostObj,
    shippingObj,
    eFeeObj,
    eFeePerOrderObj,
    profitObj,
    expensesObj,
    roiObj,
    poasObj,
  ];

  return metricObjects;
}

function returnMetricHTML(metric) {
  return `<div   class="additional-metrics"><p class="wt-text-caption-title wt-mb-xs-2 wt-no-wrap">${
    metric.metricName
  }</p><p class="wt-text-heading">${
    metric.symbol == "$" ? "$" : ""
  }${metric.metricValue.toFixed(2)}${
    metric.symbol == "%" ? "%" : ""
  }</p></div>`;
}

function convertAbbreviatedNumber(abbreviatedNumber) {
  // Extract the numeric part and the multiplier (e.g., '2' and 'K')
  const numericPart = parseFloat(abbreviatedNumber);
  const multiplier = abbreviatedNumber.slice(-1).toLowerCase();

  // Define multipliers and their corresponding numeric values
  const multipliers = {
    k: 1000,
    m: 1000000,
    b: 1000000000,
    t: 1000000000000,
  };

  // Check if the multiplier is valid
  if (multipliers.hasOwnProperty(multiplier)) {
    return numericPart * multipliers[multiplier];
  } else {
    // If no valid multiplier is found, return the original numeric value
    return numericPart;
  }
}

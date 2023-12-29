function returnMetricHTML(metric) {
  let value = metric.metricValue;
  if (typeof value === "number") {
    if (metric.symbol == "%") {
      value = metric.metricValue * 100;
    }
    const prefixes = metric.symbol == "$" ? "$" : "";
    const suffixes = metric.symbol == "%" ? "%" : "";
    value = prefixes + value.toFixed(2) + suffixes;
  }
  return `<div   class="additional-metrics"><p class="wt-text-caption-title wt-mb-xs-2 wt-no-wrap">${metric.metricName}</p><p class="wt-text-heading">${value}</p></div>`;
}

function convertAbbreviatedNumber(abbreviatedNumber) {
  // be careful with number as: US$-90,4K. Have to convert K to 1000, delete comma, and delete the currency, sometimes currency is $ and sometimes it is US$
  let numericPart = abbreviatedNumber;
  const regex = /-?\d+(?:,\d+)*(?:\.\d+)?[kmbt]?/gi;
  numericPart = numericPart.match(regex)[0];
  const multipliersData = {
    k: 1000,
    m: 1000000,
    b: 1000000000,
    t: 1000000000000,
  };

  function containsMultiplier(str) {
    const keys = Object.keys(multipliersData);
    for (const key of keys) {
      if (str.toLowerCase().includes(key)) {
        return true;
      }
    }
    return false;
  }

  if (containsMultiplier(abbreviatedNumber)) {
    numericPart = numericPart.replace(/,/g, ""); // Remove commas
    const multiplier = numericPart.slice(-1).toLowerCase();

    // Check if the last character is a valid multiplier
    if (multipliersData.hasOwnProperty(multiplier)) {
      numericPart = parseFloat(numericPart); // Convert to a float to handle decimal points

      numericPart *= multipliersData[multiplier];
    }
  } else {
    numericPart = parseFloat(numericPart.replace(/,/g, "")); // Convert to a float and remove commas
  }

  return numericPart;
}

async function getManualMetric(metricName) {
  const input = $(
    '.om-input-manual-metric[data-variable-name="' + metricName + '"]'
  );

  const val = input.val();
  console.log("val", val);
  return val;
}

async function getMetrics() {
  const basecost = parseFloat(await getManualMetric("basecost"));
  const shipping = parseFloat(await getManualMetric("shipping"));
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
    $("#revenue-tab-content  .wt-text-heading").text()
  );
  const spend = convertAbbreviatedNumber(
    $("#spent-tab-content  .wt-text-heading").text()
  );

  const clicksRate = clicks / views;
  const cr = orders / clicks;
  const cpc = spend / clicks;
  const eFee = revenue * 0.03 + revenue * 0.065 + orders * (0.2 + 0.35);
  let cpp, aov, eFeePerOrder;
  if (orders) {
    cpp = spend / orders;
    aov = revenue / orders;
    eFeePerOrder = eFee / orders;
  } else {
    cpp = "No Order";

    aov = "No Order";
    eFeePerOrder = "No Order";
  }

  const profit = revenue + shipping * orders - spend - basecost * orders - eFee;
  const expenses = eFee + spend + basecost * orders;
  const roi = profit / expenses;
  const poas = (revenue - basecost * orders - eFee + shipping * orders) / spend;

  const clicksRateObj = {
    metricName: "Clicks Rate",
    clicksRate,
    metricValue: clicksRate,
    symbol: "%",
  };
  const crObj = { metricName: "CR", metricValue: cr, cr, symbol: "%" };
  const cpcObj = { metricName: "CPC", metricValue: cpc, cpc, symbol: "$" };
  const cppObj = { metricName: "CPP", metricValue: cpp, cpp, symbol: "$" };
  const aovObj = { metricName: "AOV", aov, metricValue: aov, symbol: "$" };

  const eFeeObj = { metricName: "E-Fee", metricValue: eFee, eFee, symbol: "$" };
  const eFeePerOrderObj = {
    metricName: "E-Fee per Order",
    metricValue: eFeePerOrder,
    eFeePerOrder,
    symbol: "$",
  };
  const profitObj = {
    metricName: "Profit",
    metricValue: profit,
    profit,
    symbol: "$",
  };
  const expensesObj = {
    metricName: "Expenses",
    metricValue: expenses,
    expenses,
    symbol: "$",
  };
  const roiObj = { metricName: "ROI", metricValue: roi, symbol: "%", roi };
  const poasObj = { metricName: "POAS", metricValue: poas, symbol: "$", poas };

  // Array of metric objects
  const metricObjects = {
    clicksRate: clicksRateObj,
    cr: crObj,
    cpc: cpcObj,
    cpp: cppObj,
    aov: aovObj,
    eFee: eFeeObj,
    eFeePerOrder: eFeePerOrderObj,
    profit: profitObj,
    expenses: expensesObj,
    roi: roiObj,
    poas: poasObj,
  };

  return metricObjects;
}

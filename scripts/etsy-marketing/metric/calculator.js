function returnMetricHTML(metric) {
  let value = metric.metricValue;
  if (metric.symbol == "%") {
    value = metric.metricValue * 100;
  }
  return `<div   class="additional-metrics"><p class="wt-text-caption-title wt-mb-xs-2 wt-no-wrap">${
    metric.metricName
  }</p><p class="wt-text-heading">${
    metric.symbol == "$" ? "$" : ""
  }${value.toFixed(2)}${metric.symbol == "%" ? "%" : ""}</p></div>`;
}

function convertAbbreviatedNumber(abbreviatedNumber) {
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

  let numericPart = abbreviatedNumber;

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

async function setManualMetric(event) {
  const metricName = $(event.target).data("variable-name");
  const metricValue = $(event.target).val();
  const data = {};
  data[metricName] = metricValue;
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: "setLocalStorage", data },
      function (response) {
        resolve(response.message);
        $(event.target).blur();
      }
    );
  });
}
async function getManualMetric(metricName) {
  const input = $(
    '.om-input-manual-metric[data-variable-name="' + metricName + '"]'
  );

  const val = input.val();
  console.log("val", val);
  return val;
}
async function getManualMetric_old(metricName) {
  const res = await chrome.runtime.sendMessage({
    action: "getLocalStorage",
    metricName,
  });

  if (res) {
    console.log("running callback of sendmessage getlocalstorage", res);
    return res.data[metricName];
  } else {
    console.log("not receive anything", res);
  }
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
    $("#revenue-tab-content  .wt-text-heading").text().substring(1)
  );
  const spend = convertAbbreviatedNumber(
    $("#spent-tab-content  .wt-text-heading").text().substring(1)
  );

  const clicksRate = clicks / views;
  const cr = orders / clicks;
  const cpc = spend / clicks;
  const cpp = spend / orders;
  const aov = revenue / orders;
  const eFee = revenue * 0.03 + revenue * 0.065 + orders * (0.2 + 0.35);
  const eFeePerOrder = eFee / orders;
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

let allKeywords;
let enabledKeywords;
let disabledKeywords;

let isContain;
let basecost;
let shipping;
const keywordTableSelector =
  "table:has(th:has(p:contains('Buyers searched for'))) ";
let owner_id = "";
let listing_id = "";
let high = `<span class="wt-badge wt-m-xs-2 wt-badge--notificationTertiary">High</span>`;
let views, orders, clicks, revenue, spend, fullDataToFillTable;
let sortBy = ["impressionCounts", true];

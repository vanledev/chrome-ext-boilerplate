window.addEventListener("message", async function (event) {
  // Your event handling logic goes here
  console.log("window receiv message", event);
  const { data, url } = event.data || {};

  if (url?.includes("prolist/listings/querystats")) {
    await whenHaveKeywords(data);
  } else if (url?.includes("prolist/stats/listings")) {
    owner_id = data.listing.listingImages[0].ownerId;
    listing_id = data.listing.listingId;

    views = data.totalStats.impressionCount;
    orders = data.totalStats.conversions;
    clicks = data.totalStats.clickCount;

    revenue = data.totalStats.revenue / 100;
    spend = data.totalStats.spentTotal / 100;
    addMetricToDom();
  }
});


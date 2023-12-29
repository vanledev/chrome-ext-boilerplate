main2();
async function main2() {
  await sleep(5000);
  const button = $(`<button id="send-request-to-etsy">Send</button>`);
  const place = $("#listing-detail-stats-date-menu-button");
  console.log(place);
  button.insertAfter(place);
  $("#send-request-to-etsy").on("click", fetchToEtsy);
}

async function fetchToEtsy() {
  let csrf = $("meta[name='csrf_nonce']").attr("content");

  const keyword = `crochet patterns`;
  const is_relevant = `false`;

  const res = await fetch(
    `https://www.etsy.com/api/v3/ajax/shop/${owner_id}/prolist/listing-query`,
    {
      headers: {
        "x-csrf-token": csrf,
      },
      referrer: `https://www.etsy.com/your/shops/me/advertising/listings/${listing_id}?ref=dashboard-tabs`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{"listing_id":${listing_id},"query":"${keyword}","is_relevant":${is_relevant}}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  console.log("response keyword toggle", res);
  if (res.status == 201) {
    showNoti("toggleKeywordSuccess");
  }
}

async function fetchToEtsy(keyword, is_relevant) {
  let csrf = $("meta[name='csrf_nonce']").attr("content");

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
  return res;
}
 
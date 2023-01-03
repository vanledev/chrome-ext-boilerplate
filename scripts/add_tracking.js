const detectCarrierCode = (tracking = "") => {
   tracking = String(tracking).trim();
   if (tracking.startsWith("RS")) {
      return "deutsche-post";
   }
   if (tracking.startsWith("LG")) {
      return "royal-mail";
   }
   if (tracking.startsWith("92")) {
      return "usps";
   }
   const allowedString = [
      "GM",
      "LX",
      "RX",
      "UV",
      "CN",
      "SG",
      "TH",
      "IN",
      "HK",
      "MY",
      "42",
      "92",
   ];
   if (tracking.length < 2) {
      return "";
   }
   tracking = tracking.toUpperCase();
   const start = tracking.slice(0, 2);
   if (tracking.startsWith("1Z") || start.includes("80")) {
      return "ups";
   }
   if (tracking.startsWith("303")) {
      return "4px";
   }
   if (
      (start === "94" || start === "93" || start === "92") &&
      tracking.length !== 10
   ) {
      return "usps";
   }
   if (allowedString.includes(start)) {
      if (tracking.length > 12) {
         return "dhlglobalmail";
      }
   }
   if (start === "UE" || start === "UF") {
      return "yanwen";
   }
   if (start === "SF") {
      return "sfb2c";
   }
   if (start === "61" || (start === "77" && tracking.length == 12)) {
      return "fedex";
   }
   if (start === "23") {
      return "japan-post";
   }
   if (start === "YT") {
      return "yunexpress";
   }
   if (start === "US") {
      return "jetlogistic";
   }
   if (
      ["82", "69", "30", "75"].includes(start) ||
      tracking.length === 10 ||
      tracking.length === 8
   ) {
      return "dhl";
   }
   return "china-ems";
};

const detectCarrierValue = (carrierCode = "") => {
   switch (carrierCode) {
      case "usps":
         return 1;
      case "ups":
         return 2;
      case "fedex":
         return 3;
      case "dhl":
         return 4;
      default:
         break;
   }
   return 0;
};

const executeAddTracking = async (orderId, tracking) => {
   if (!orderId) {
      notifyError("Order not found.");
      return;
   }
   if (!tracking) {
      notifyError("Tracking Order not found.");
      return;
   }
   const carrierCode = detectCarrierValue(detectCarrierCode(tracking));
   if (!carrierCode) {
      notifyError("Could not detect carrier from tracking.");
      return;
   }
   // click show model order detail
   $(`.flag-body.wt-vertical-align-top[data-order-id="${orderId}"]`).trigger(
      "click"
   );
   // wait modal order info
   const linkXpath = `#order-details-order-info [href="https://www.etsy.com/your/orders/${orderId}?order_id=${orderId}"]`;
   let timeOutOrderInfo = 0;
   while (true) {
      if (timeOutOrderInfo == 60) {
         notifyError("Could not open model order info.");
         return;
      }
      if ($(linkXpath).length) break;
      await sleep(500);
      timeOutOrderInfo++;
   }
   // wait btn complete order
   const btnCompleteXpath =
      '#order-detail-container [data-test-id="no-user-defined-steps-update-progress-button"] button';
   let timeOutBtnComplete = 0;
   while (true) {
      if (timeOutBtnComplete == 60) {
         notifyError("Could not found button Complete Order");
         return;
      }
      if ($(btnCompleteXpath).length) break;
      await sleep(500);
      timeOutBtnComplete++;
   }
   $(btnCompleteXpath).trigger("click");
   // wait modal add tracking
   let timeOutModalTracking = 0;
   while (true) {
      if (timeOutModalTracking == 60) {
         notifyError("Could not open model add tracking.");
         return;
      }
      if ($("#mark-as-complete-overlay").length) break;
      await sleep(500);
      timeOutModalTracking++;
   }
   // wait shipping carrier
   let timeOutCarrierSelect = 0;
   while (true) {
      if (timeOutCarrierSelect == 30) {
         notifyError("Could not find select carrier.");
         return;
      }
      if ($("#shipping-carrier-select").length) break;
      await sleep(500);
      timeOutCarrierSelect++;
   }
   const carrierOptionXpath = `#shipping-carrier-select option[value="${carrierCode}"]`;
   if (!$(carrierOptionXpath).length) {
      notifyError("Carrier not found.");
      return;
   }
   // select carrier
   const carrierElem = document.querySelector(carrierOptionXpath);
   carrierElem.value = carrierCode;
   const carrierEvent = document.createEvent("HTMLEvents");
   carrierEvent.initEvent("change", true, true);
   carrierElem.dispatchEvent(carrierEvent);
   await sleep(2000);
   // enter tracking
   const trackingXpath = `#mark-as-complete-overlay input[name="trackingCode-${orderId}"]`;
   let timeOutTrackingInput = 0;
   while (true) {
      if (timeOutTrackingInput == 30) {
         notifyError("Could not find tracking input.");
         return;
      }
      if ($(trackingXpath).length) break;
      await sleep(500);
      timeOutTrackingInput++;
   }
   const trackingInputElem = $(trackingXpath);
   trackingInputElem.focus();
   trackingInputElem.val("");
   document.execCommand("insertText", false, tracking);
   trackingInputElem.blur();
   await sleep(3000);
   // submit add tracking
   const btnXpath =
      "#mark-as-complete-overlay .wt-overlay__footer__action .wt-btn--filled";
   let timeOutBtn = 0;
   while (true) {
      if (timeOutBtn == 30) {
         notifyError("Button Complete Order not found.");
         return;
      }
      if ($(btnXpath).length) break;
      await sleep(500);
      timeOutBtn++;
   }
   $(btnXpath).trigger("click");
   // wait response add tracking
   const xpathSuccess = "#order-detail-container .strong.display-inline";
   let timeOutSuccess = 0;
   while (true) {
      if (timeOutSuccess == 60) {
         notifyError("Could not add tracking for order.");
         return;
      }
      if ($(xpathSuccess).length) break;
      await sleep(500);
      timeOutSuccess++;
   }
   // show response success
   $(`#add_tracking tr[data-order-id="${orderId}"]`).remove();
   if ($(`#add_tracking tr`).length == 0) {
      $(".btn-add-tracking-wrap").css("display", "none");
      if (!$("#add_tracking .om-not-found-wrap").length)
         $("#add_tracking .table_wrap").append(orderNotFound);
   }
   notifySuccess("Add tracking success.");
   await sleep(1000);
   const closeModalXpath = "button.btn-transparent.position-top";
   if ($(closeModalXpath).length) $(closeModalXpath).trigger("click");
};

$(document).on("click", ".add-tracking-item", async function () {
   const orderId = $(this).attr("data-order-id");
   const tracking = $(this).attr("data-tracking");
   if (!orderId) {
      notifyError("Order not found.");
      return;
   }
   if (!tracking) {
      notifyError("Tracking Order not found.");
      return;
   }
   $("#add-trackings").addClass("loader");
   $(this).addClass("loader");
   await executeAddTracking(orderId, tracking);
   $(this).removeClass("loader");
   $("#add-trackings").removeClass("loader");
});

$(document).on("click", "#add-trackings", async function () {
   const orders = [];
   // check sync order specify
   let isAddTrackingSpecify = false;
   $(".force-add-tracking-item .om-checkbox").each(function () {
      if ($(this).is(":checked")) {
         isAddTrackingSpecify = true;
         return false;
      }
   });
   $(".force-add-tracking-item .om-checkbox").each(function () {
      const orderId = $(this).attr("data-order-id");
      const tracking = $(this).attr("data-tracking");
      if (!orderId || !tracking) return true;
      if (isAddTrackingSpecify) {
         if ($(this).is(":checked")) orders.push({ orderId, tracking });
         return true;
      }
      orders.push({ orderId, tracking });
   });
   if (orders.length == 0) {
      notifyError("Order not found.");
      return;
   }
   $(this).addClass("loader");
   for (const { orderId, tracking } of orders) {
      $(`.add-tracking-item[data-order-id="${orderId}"]`).addClass("loader");
      await executeAddTracking(orderId, tracking);
      await sleep(4000);
      $(`.add-tracking-item[data-order-id="${orderId}"]`).removeClass("loader");
   }
   $(this).removeClass("loader");
});

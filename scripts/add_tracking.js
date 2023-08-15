const detectCarrierCode = (tracking = "") => {
   tracking = String(tracking).trim();
   if (tracking.startsWith("RS")) {
      return "deutsche-post";
   }
   if (tracking.startsWith("LG")) {
      return "royal-mail";
   }

   // 420712919374811015300249592366
   if (tracking.startsWith("92") || tracking.startsWith("420") && tracking.length === 30) {
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
   if (tracking.startsWith("YT")) {
      notifyError("Invalid Tracking Order.");
      return;
   }
   const carrierCode = detectCarrierValue(detectCarrierCode(tracking));
   if (!carrierCode) {
      notifyError("Could not detect carrier from tracking.");
      return;
   }
   // click btn update progress
   // const btnUpdateProgressXpath = `.flag-img [role="tablist"][data-order-id="${orderId}"] .wt-mb-xs-1:nth-child(2) button`;
   const btnUpdateProgressXpath = `.flag-img[data-order-id="${orderId}"] .wt-mb-xs-1:nth-child(2) button`;
   let timeOutBtnUpdateProgress = 0;
   while (true) {
      if (timeOutBtnUpdateProgress == 60) {
         notifyError("Order not found.");
         return;
      }
      if ($(btnUpdateProgressXpath).length) break;
      await sleep(500);
      timeOutBtnUpdateProgress++;
   }
   $(btnUpdateProgressXpath).trigger("click");
   // check has option progress
   const progressOptionXpath = `.flag-img[data-order-id="${orderId}"] .list-unstyled li:last-child .btn-primary`;
   if ($(progressOptionXpath).length) {
      let timeOutOrderInfo = 0;
      while (true) {
         if (timeOutOrderInfo == 60) {
            notifyError("Could not open progress options.");
            return;
         }
         if ($(progressOptionXpath).length) break;
         await sleep(500);
         timeOutOrderInfo++;
      }
      // click btn complete order
      const btnCompleteElem = document.querySelector(progressOptionXpath);
      const btnCompleteEvent = document.createEvent("HTMLEvents");
      btnCompleteEvent.initEvent("click", true, true);
      btnCompleteElem.dispatchEvent(btnCompleteEvent);
   }
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
   await sleep(1000);
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
   await sleep(1000);
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
   // show response success
   $(`#add_tracking tr[data-order-id="${orderId}"]`).remove();
   if ($(`#add_tracking tr`).length == 0) {
      $(".btn-add-tracking-wrap").css("display", "none");
      if (!$("#add_tracking .om-not-found-wrap").length)
         $("#add_tracking .table_wrap").append(orderNotFound);
   }
   notifySuccess("Add tracking success.");
   await sleep(1000);
};

const setTextBtnAddTrack = () => {
   let hasChecked = false;
   $(".force-add-tracking-item .om-checkbox").each(function () {
      if ($(this).is(":checked")) {
         hasChecked = true;
         return false;
      }
   });
   if (hasChecked) $("#add-trackings").text("Add Tracks Selected Orders");
   else $("#add-trackings").text("Add Trackings");
};

// checked force add tracking
$(document).on(
   "click",
   ".force-add-tracking-all-item .om-checkbox",
   async function () {
      if ($(this).is(":checked"))
         $(".force-add-tracking-item .om-checkbox").each(function () {
            if (!$(this).is(":checked")) $(this).click();
         });
      else
         $(".force-add-tracking-item .om-checkbox").each(function () {
            if ($(this).is(":checked")) $(this).click();
         });
      setTextBtnAddTrack();
   }
);

// checked force add all tracking
$(document).on("click", ".force-add-tracking-item .om-checkbox", function () {
   setTextBtnAddTrack();
});

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
   await fetchTrackChinaToUS();
   if ($(`#add_tracking tr[data-order-id="${orderId}"]`).length == 0) {
      notifyError("Order without US tracking code.");
      return;
   }
   $("#add-trackings").addClass("loader");
   $(this).addClass("loader");
   await executeAddTracking(orderId, tracking);
   $(this).removeClass("loader");
   $("#add-trackings").removeClass("loader");
});

$(document).on("click", "#add-trackings", async function () {
   await fetchTrackChinaToUS();
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

const trackChinaToUS = {
   trackings: [],
   fetched: false,
};
const fetchTrackChinaToUS = async () => {
   const trackings = [];
   $(".force-add-tracking-item .om-checkbox").each(function () {
      const tracking = $(this).attr("data-tracking");
      if (tracking.startsWith("YT")) trackings.push(tracking);
   });
   if (trackings.length == 0) return;
   const endpoint = `https://www.yuntrack.com/parcelTracking?id=${trackings.join(
      ","
   )}`;
   chrome.runtime.sendMessage({
      message: "fetchTrackChinaToUS",
      data: {
         endpoint,
      },
   });
   while (true) {
      await sleep(1000);
      if (trackChinaToUS.fetched) break;
   }
   for (const tracking of trackings) {
      let isValid = false;
      for (const { oldTrack, newTrack } of trackChinaToUS.trackings) {
         if (tracking == oldTrack) {
            isValid = true;
            const orderId = $(
               `.force-add-tracking-item [data-tracking="${oldTrack}"] `
            ).attr("data-order-id");
            $(`.force-add-tracking-item [data-tracking="${oldTrack}"]`).attr(
               "data-tracking",
               newTrack
            );
            $(
               `#add_tracking [data-order-id="${orderId}"] .om-tracking-tag:last-child`
            ).text(newTrack);
            $(`.add-tracking-item [data-tracking="${oldTrack}"]`).attr(
               "data-tracking",
               newTrack
            );
         }
      }
      if (!isValid) {
         const orderId = $(
            `.force-add-tracking-item [data-tracking="${tracking}"] `
         ).attr("data-order-id");
         $(`#add_tracking tr[data-order-id="${orderId}"]`).remove();
      }
   }

   const res = [...trackChinaToUS.trackings];
   trackChinaToUS.trackings = [];
   trackChinaToUS.fetched = false;
   return res;
};

chrome.runtime.onMessage.addListener(async function (req, sender, res) {
   const { message, data } = req || {};
   if (message === "fetchTrackChinaToUS") {
      res({ message: "received" });
      let validTracks = [];
      let countTimeout = 0;
      let isValid = false;
      while (true) {
         if (countTimeout == 30) break;
         if ($(".el-table__row").length > 0) {
            isValid = true;
            break;
         }
         countTimeout++;
         await sleep(1000);
      }
      if (isValid) {
         for (let i = 1; i <= $(".el-table__row").length; i++) {
            let oldTrack = $(
               `.el-table__row:nth-child(${i}) td:nth-child(2) .cell>div:nth-child(1)`
            ).text();
            let newTrack = $(
               `.el-table__row:nth-child(${i}) td:nth-child(4) .cell>div:nth-child(1)`
            ).text();
            if (!oldTrack || !newTrack) continue;
            newTrack = newTrack.trim();
            if (!newTrack.startsWith("92")) continue;
            validTracks.push({ oldTrack, newTrack });
         }
      }
      chrome.runtime.sendMessage({
         message: "fetchedTrackChinaToUS",
         data: { ...data, validTracks },
      });
   }
   if (message === "fetchedTrackChinaToUS") {
      res({ message: "received" });
      const { validTracks } = data;
      trackChinaToUS.trackings = validTracks;
      trackChinaToUS.fetched = true;
   }
});

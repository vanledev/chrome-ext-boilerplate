const orderNotFound = `
   <div class="om-not-found-wrap">
      <div style="padding:20px 10px;"><img style="width:30px;object-fit:cover;" src="${chrome.runtime.getURL(
         "assets/images/not-found.png"
      )}"/></div>
      <div class="om-text-not-found" >Orders not found</div>
   </div>
`;

const syncedAllOrders = `
   <div class="om-synced-all-wrap">
      <div style="padding:20px 10px;"><img style="width:30px;object-fit:cover;" src="${chrome.runtime.getURL(
         "assets/images/completed.png"
      )}"/></div>
      <div class="om-text-synced-all" >All orders were synced to MB</div>
   </div>
`;

const statusLabel = (status, colorCode) => `
   <div class="om-status-label-wrap" data-status="${status}">
      <span class="om-status-label" style="background-color:${colorCode};">${status}</span>
   </div>
`;

const addStatusLabel = (orderInfos) => {
   if (!orderInfos) return;
   // orderInfos = {
   //    [orderId]: {
   //       status: String,
   //       trackingCode: String
   //    }
   // }
   const ordersXpath = "#browse-view .panel-body-row";
   for (let i = 0; i < $(ordersXpath).length; i++) {
      const item = $(ordersXpath)?.eq(i);
      const orderId = item?.find("h3 a:first-child")?.text()?.split("#")?.pop();
      console.log("orderId: ", orderId);
      if (!orderId || !orderInfos[orderId]) continue;
      const addLabelXpath = ".flag .col-group .col-md-4";
      item
         .find(addLabelXpath)
         .append(`<div class="wt-mt-xs-2 om-order-info"></div>`);
      const elem = item.find(addLabelXpath + " .om-order-info");
      const { status, trackingCode } = orderInfos[orderId];
      switch (status) {
         case "Synced":
            if (!item.find(`[data-status="Synced"]`).length)
               elem.append(statusLabel("Synced", "#008060"));
            if (trackingCode) {
               if (!item.find(`[data-status="Tracking Available"]`).length)
                  elem.append(statusLabel("Tracking Available", "#008060"));
            } else {
               if (!item.find(`[data-status="Tracking Not Available"]`).length)
                  elem.append(statusLabel("Tracking Not Available", "#f44336"));
            }
            break;
         case "Not Synced":
            if (!item.find(`[data-status="Not Synced"]`).length)
               elem.append(statusLabel("Not Synced", "#f44336"));
            break;
         case "Ignored":
            if (!item.find(`[data-status="Ignored"]`).length)
               elem.append(statusLabel("MB Ignored", "#f44336"));
            break;
         default:
            break;
      }
   }
};

const removeTableLoading = () => {
   // remove loading
   $("#not_synced .loader-resp").remove();
   $("#ignored .loader-resp").remove();
   $("#add_tracking .loader-resp").remove();
   // show not synced table
   if (!$("#not_synced table").length)
      $("#not_synced").prepend(`
          <div class="table_wrap">
             <table class="om-table">
               <thead>
                  <tr>
                     <th class="force-sync-all-item">
                        <input class="om-checkbox" type="checkbox" />
                     </th>
                     <th>Image</th>
                     <th>Order ID</th>
                     <th>Action</th>
                  </tr>
               </thead>
               <tbody></tbody>
             </table>
          </div>
       `);
   // show ignore table
   if (!$("#ignored table").length)
      $("#ignored").prepend(`
          <div class="table_wrap">
             <table class="om-table">
               <thead>
                  <tr>
                     <th class="force-revert-all-item">
                        <input class="om-checkbox" type="checkbox" />
                     </th>
                     <th>Image</th>
                     <th>Order ID</th>
                     <th>Action</th>
                  </tr>
                </thead>
                <tbody></tbody>
             </table>
          </div>
       `);
   // // show tracking table
   // if (!$("#add_tracking table").length)
   //    $("#add_tracking").prepend(`
   //       <div class="table_wrap">
   //          <table class="om-table">
   //            <thead>
   //               <tr>
   //                  <th class="force-revert-all-item">
   //                     <input class="om-checkbox" type="checkbox" />
   //                  </th>
   //                  <th>Image</th>
   //                  <th>Order ID</th>
   //                  <th>Action</th>
   //               </tr>
   //             </thead>
   //             <tbody></tbody>
   //          </table>
   //       </div>
   //    `);
};

const appendOrdersIntoTable = (data) => {
   removeTableLoading();
   if (!data) return;
   const { orders, mbInfos = {} } = data;
   addStatusLabel(mbInfos);

   let hasNotSync = false;
   let hasIgnore = false;
   let hasTracking = false;
   for (const order of orders) {
      // add order into not sync table
      if (!order) continue;
      const { status, trackingCode } = mbInfos[order.orderId];
      if (status === "Not Synced") {
         hasNotSync = true;
         if (!$(`#not_synced tr[data-order-id="${order.orderId}"]`).length) {
            $("#not_synced .om-table tbody").append(`
               <tr data-order-id="${order.orderId}">
                  <td class="force-sync-item"><input data-order="${b64Encode(
                     order
                  )}" class="om-checkbox" type="checkbox"></td>
                  <td> <img class="om-img-75" src="${
                     order.items[0].image
                  }" /></td>
                  <td>${order.orderId}</td>
                  <td><button class="sync-order-item om-btn" data-order-id="${
                     order.orderId
                  }" data-order="${b64Encode(order)}">Sync</button></td>
               </tr>
            `);
         }
      }
      // add order into ignored table
      if (status === "Ignored") {
         hasIgnore = true;
         if (!$(`#ignored tr[data-order-id="${order.orderId}"]`).length) {
            $("#ignored .om-table tbody").append(`
               <tr data-order-id="${order.orderId}">
                  <td class="force-revert-item"><input data-order="${b64Encode(
                     order
                  )}" class="om-checkbox" type="checkbox"></td>
                  <td> <img class="om-img-75" src="${
                     order.items[0].image
                  }" /></td>
                  <td>${order.orderId}</td>
                  <td><button class="revert-order-item om-btn" data-order-id="${
                     order.orderId
                  }" data-order="${b64Encode(order)}">Revert</button></td>
               </tr>
            `);
         }
      }
      // add order into tracking table
      if (trackingCode) {
         hasTracking = true;
         // if (!$(`#add_tracking tr[data-order-id="${order.orderId}"]`).length) {
         //    $("#add_tracking .om-table tbody").append(`
         //       <tr data-order-id="${order.orderId}">
         //          <td class="force-add-tracking-item"><input data-order="${b64Encode(
         //             order
         //          )}" class="om-checkbox" type="checkbox"></td>
         //          <td> <img class="om-img-75" src="${
         //             order.items[0].image
         //          }" /></td>
         //          <td>
         //             <span class="om-order-id-tag">${order.orderId}</span>
         //             <span class="om-tracking-tag">${trackingCode}</span>
         //          </td>
         //          <td><button class="add-tracking-item om-btn" data-order-id="${
         //             order.orderId
         //          }" data-order="${b64Encode(order)}">Add</button></td>
         //       </tr>
         //    `);
         // }
      }
   }
   if (hasNotSync) $(".btn-sync-order-wrap").css("display", "flex");
   else {
      $("#not_synced .table_wrap").append(syncedAllOrders);
      $("#not_synced .btn-sync-order-wrap").css("display", "none");
   }
   if (hasIgnore) $(".btn-revert-order-wrap").css("display", "flex");
   else {
      if (!$("#ignored .table_wrap .om-not-found-wrap").length)
         $("#ignored .table_wrap").append(orderNotFound);
      $("#ignored .btn-revert-order-wrap").css("display", "none");
   }
   // if (hasTracking) $(".btn-add-tracking-wrap").css("display", "flex");
   // else {
   //    if (!$("#add_tracking .table_wrap .om-not-found-wrap").length)
   //       $("#add_tracking .table_wrap").append(orderNotFound);
   //    $("#add_tracking .btn-add-tracking-wrap").css("display", "none");
   // }
};

const setTextBtnSync = () => {
   let hasChecked = false;
   $(".force-sync-item .om-checkbox").each(function () {
      if ($(this).is(":checked")) {
         hasChecked = true;
         return false;
      }
   });
   if (hasChecked) $("#sync-order").text("Sync Selected Orders");
   else $("#sync-order").text("Sync Orders");
};

const setTextBtnRevert = () => {
   let hasChecked = false;
   $(".force-revert-item .om-checkbox").each(function () {
      if ($(this).is(":checked")) {
         hasChecked = true;
         return false;
      }
   });
   if (hasChecked) $("#revert-order").text("Revert Selected Orders");
   else $("#revert-order").text("Revert Orders");
};

// listing event from background
chrome.runtime.onMessage.addListener(async function (req, sender, res) {
   const { message, data } = req || {};
   if (message === "orders") {
      res({ message: "received" });
      if (!data) {
         return;
      }
      const { error } = data || {};
      if (error) {
         notifyError("Check synced order: " + data.error);
         return;
      }
      appendOrdersIntoTable(data);
   }

   if (message === "syncOrderToMB") {
      res({ message: "received" });
      $(".loader").removeClass("loader");
      const {
         data: { error: message },
         error,
         orders,
      } = data;
      let hasError = false;
      if (error) {
         notifyError(error);
         return;
      }
      for (const order of orders) {
         if (message[order.orderId]) hasError = true;
         else $(`tr[data-order-id="${order.orderId}"]`).remove();
      }
      if (!hasError) notifySuccess("Sync orders success.");
      else {
         for (const order of Object.entries(message)) {
            notifySuccess(order[0] + ": " + order[1]);
         }
      }
      // If the order is out of stock, then add not found
      if (!$("#not_synced tr[data-order-id]").length) {
         if (!$("#not_synced .table_wrap .om-not-found-wrap").length)
            $("#not_synced .table_wrap").append(orderNotFound);
         $(".btn-sync-order-wrap").css("display", "none");
      }
      setTextBtnSync();
   }
   if (message === "deleteIgnoreEtsyOrder") {
      res({ message: "received" });
      $(".loader").removeClass("loader");
      const { orders, data: result, error } = data;
      if (error) {
         notifyError("Delete ignore order: " + error);
         return;
      }
      notifySuccess("Delete ignore order success.");
      for (const order of orders) {
         const status = result[order["orderId"]];
         if (status !== "Ignored")
            $(`#ignored tr[data-order-id="${order.orderId}"]`).remove();
         if (status === "Not Synced")
            if (!$(`#not_synced tr[data-order-id="${order.orderId}"]`).length) {
               $("#not_synced .om-table").append(`
                  <tr data-order-id="${order.orderId}">
                     <td class="force-sync-item"><input data-order="${b64Encode(
                        order
                     )}" class="om-checkbox" type="checkbox"></td>
                     <td> <img class="om-img-75" src="${
                        order.items[0].image
                     }" /></td>
                     <td>${order.orderId}</td>
                     <td><button class="sync-order-item om-btn" data-order-id="${
                        order.orderId
                     }" data-order="${b64Encode(order)}">Sync</button></td>
                  </tr>
               `);
            }
      }
      if ($("#ignored tr[data-order-id]").length == 0) {
         if (!$("#ignored .table_wrap .om-not-found-wrap").length)
            $("#ignored .table_wrap").append(orderNotFound);
         $("#ignored .btn-revert-order-wrap").css("display", "none");
      }
      setTextBtnRevert();
   }
   return;
});

// control tabs sync orders
$(document).on("click", `.sync-order-wrap .tablinks`, function (e) {
   $(".sync-order-wrap .tabcontent").each(function () {
      $(this).css("display", "none");
   });
   $(".sync-order-wrap .tablinks").each(function () {
      $(this).removeClass("om-active om-active-tab");
   });
   $(`#${$(this).attr("data-name")}`).css("display", "block");
   $(this).addClass("om-active om-active-tab");
});

// checked force sync orders
$(document).on("click", ".force-sync-all-item .om-checkbox", function () {
   if ($(this).is(":checked"))
      $(".force-sync-item .om-checkbox").each(function () {
         if (!$(this).is(":checked")) $(this).click();
      });
   else
      $(".force-sync-item .om-checkbox").each(function () {
         if ($(this).is(":checked")) $(this).click();
      });
   setTextBtnSync();
});
// checked force sync order item
$(document).on("click", ".force-sync-item .om-checkbox", function () {
   setTextBtnSync();
});

// checked force revert orders
$(document).on("click", ".force-revert-all-item .om-checkbox", function () {
   if ($(this).is(":checked"))
      $(".force-revert-item .om-checkbox").each(function () {
         if (!$(this).is(":checked")) $(this).click();
      });
   else
      $(".force-revert-item .om-checkbox").each(function () {
         if ($(this).is(":checked")) $(this).click();
      });
   setTextBtnRevert();
});
// checked force revert order item
$(document).on("click", ".force-revert-item .om-checkbox", function () {
   setTextBtnRevert();
});

// click sync orders
$(document).on("click", "#sync-order", async function () {
   const orders = [];
   // check sync order specify
   let isSyncOrderSpecify = false;
   $(".force-sync-item .om-checkbox").each(function () {
      if ($(this).is(":checked")) {
         isSyncOrderSpecify = true;
         return false;
      }
   });
   $(".force-sync-item .om-checkbox").each(function () {
      const orderString = $(this).attr("data-order");
      if (!orderString) return true;
      const order = b64Decode(orderString);
      if (isSyncOrderSpecify) {
         if ($(this).is(":checked")) orders.push(order);
         return true;
      }
      orders.push(order);
   });
   if (orders.length == 0) {
      notifyError("Order not found.");
      return;
   }
   $(this).addClass("loader");
   for (const order of orders) {
      $(`.sync-order-item[data-order-id="${order.orderId}"]`).addClass(
         "loader"
      );
   }
   console.log("orders: ", orders);
   // send order ids to background
   chrome.runtime.sendMessage({
      message: "syncOrderToMB",
      data: {
         apiKey: await getStorage(mbApi),
         orders,
      },
   });
});

// click force sync order
$(document).on("click", ".sync-order-item", async function () {
   const orders = [];
   const orderString = $(this).attr("data-order");
   if (!orderString) {
      notifyError("Order not found.");
      return;
   }
   orders.push(b64Decode(orderString));
   $(this).addClass("loader");
   $("#sync-order").addClass("loader");
   console.log("orders: ", orders);
   // send order ids to background
   chrome.runtime.sendMessage({
      message: "syncOrderToMB",
      data: {
         apiKey: await getStorage(mbApi),
         orders,
      },
   });
});

// click revert orders
$(document).on("click", "#revert-order", async function () {
   const orders = [];
   // check sync order specify
   let isRevertOrderSpecify = false;
   $(".force-revert-item .om-checkbox").each(function () {
      if ($(this).is(":checked")) {
         isSyncOrderSpecify = true;
         return false;
      }
   });
   $(".force-revert-item .om-checkbox").each(function () {
      const orderString = $(this).attr("data-order");
      if (!orderString) return true;
      const order = b64Decode(orderString);
      if (isRevertOrderSpecify) {
         if ($(this).is(":checked")) orders.push(order);
         return true;
      }
      orders.push(order);
   });
   if (orders.length == 0) {
      notifyError("Order not found.");
      return;
   }
   $(this).addClass("loader");
   for (const order of orders) {
      $(`.revert-order-item[data-order-id="${order.orderId}"]`).addClass(
         "loader"
      );
   }

   // send order ids to background
   chrome.runtime.sendMessage({
      message: "deleteIgnoreOrder",
      data: {
         apiKey: await getStorage(mbApi),
         orders,
      },
   });
});

// click force revert order
$(document).on("click", ".revert-order-item", async function () {
   const orders = [];
   const orderString = $(this).attr("data-order");
   if (!orderString) {
      notifyError("Order not found.");
      return;
   }
   orders.push(b64Decode(orderString));
   $(this).addClass("loader");
   $("#revert-order").addClass("loader");
   // send order ids to background
   chrome.runtime.sendMessage({
      message: "deleteIgnoreOrder",
      data: {
         apiKey: await getStorage(mbApi),
         orders,
      },
   });
});

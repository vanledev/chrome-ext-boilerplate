const orderNotFound = `
   <div class="om-not-found-wrap">
      <div><img class="om-img-200" src="${chrome.runtime.getURL(
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

const handleEventCheckSyncedOrders = (data) => {
   // remove loading
   $("#not_synced .loader-resp").remove();
   $("#ignored .loader-resp").remove();
   // show not synced table
   if (!$("#not_synced table").length)
      $("#not_synced").prepend(`
         <div class="table_wrap">
            <table class="om-table">
               <tr>
                  <th class="force-sync-all-item">
                     <input class="om-checkbox" type="checkbox" />
                  </th>
                  <th>Image</th>
                  <th>Order ID</th>
                  <th>Action</th>
               </tr>
            </table>
         </div>
      `);
   // show ignore table
   if (!$("#ignored table").length)
      $("#ignored").prepend(`
         <div class="table_wrap">
            <table class="om-table">
               <tr>
                  <th class="force-revert-all-item">
                     <input class="om-checkbox" type="checkbox" />
                  </th>
                  <th>Image</th>
                  <th>Order ID</th>
                  <th>Action</th>
               </tr>
            </table>
         </div>
      `);

   //------------ insert data into table
   let { orders, status: orderStatus } = data;
   let hasNotSync = false;
   let hasIgnore = false;
   orders = []
   for (const order of orders) {
      // add order into not sync table
      if (orderStatus[order.orderId] === "Not Synced") {
         hasNotSync = true;
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
      // add order into ignored table
      if (orderStatus[order.orderId] === "Ignored") {
         hasIgnore = true;
         if (!$(`#ignored tr[data-order-id="${order.orderId}"]`).length) {
            $("#ignored .om-table").append(`
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
   }
   if (hasNotSync) $(".btn-sync-order-wrap").css("display", "flex");
   else {
      $("#not_synced .table_wrap").append(syncedAllOrders);
      $("#not_synced .btn-sync-order-wrap").css("display", "none");
   }

   if (hasIgnore) $(".btn-revert-order-wrap").css("display", "flex");
   else {
      $("#ignored .table_wrap").append(orderNotFound);
      $("#ignored .btn-revert-order-wrap").css("display", "none");
   }
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
      handleEventCheckSyncedOrders(data);
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

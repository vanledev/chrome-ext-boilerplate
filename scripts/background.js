const isProduction = true;
const MBUrl = isProduction
   ? "https://api.merchbridge.com/query"
   : // : "https://api-dev.merchbridge.com/query";
     "http://127.0.0.1:8080/query";
const EtsyDomain = "https://www.etsy.com";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const stopInteval = (params) => {
   clearInterval(params);
};

const sendMessage = (tabId, message, data) => {
   let timeOut = 0;
   let start = setInterval(function () {
      chrome.tabs.sendMessage(
         tabId,
         {
            message,
            data,
         },
         function (response) {
            if (!chrome.runtime.lastError && response?.message === "received")
               stopInteval(start);
            if (timeOut == 30) stopInteval(start);
         }
      );
      timeOut++;
   }, 1000);
};

const sendToContentScript = (msg, data) =>
   new Promise(async (resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         if (!tabs || !tabs.length || !tabs[0].id) return resolve(false);
         sendMessage(tabs[0].id, msg, data);
         resolve(true);
      });
   });

const getMBApiKey = () =>
   new Promise(async (resolve) => {
      const isSended = await sendToContentScript("getApiKey", null);
      if (!isSended) resolve(null);
      chrome.runtime.onMessage.addListener(async (req, sender, res) => {
         const { message, data } = req || {};
         if (message === "getApiKey" && data) resolve(data);
      });
   });

const getOrders = (data) => {
   const orders = [];
   const mapBuyer = {};
   if (!data.buyers || !data.orders) return;
   for (const buyer of data.buyers) {
      mapBuyer[buyer.buyer_id] = buyer;
   }
   for (const order of data.orders) {
      const buyer = mapBuyer[order.buyer_id];
      const shipping = order.fulfillment.to_address;
      const payment = order.payment.cost_breakdown;
      const newOrder = {
         orderId: String(order.order_id),
         buyer: {
            email: buyer?.email,
            name: buyer?.name,
         },
         shipping: {
            name: shipping.name,
            address1: shipping.first_line,
            address2: shipping.second_line,
            city: shipping.city,
            state: shipping.state,
            zipCode: shipping.zip,
            country: shipping.country,
            phone: shipping.phone,
         },
         shippingMethod: order.fulfillment.shipping_method,
         grandTotal: payment.total_cost.value / 100,
         subTotal: payment.items_cost.value / 100,
         shippingTotal: payment.shipping_cost.value / 100,
         taxTotal: payment.tax_cost.value / 100,
         discountTotal: payment.discount.value / 100,
         items: [],
      };
      for (const transaction of order.transactions) {
         const newItem = {
            itemId: String(transaction.transaction_id),
            qty: transaction.quantity,
            isDigital: transaction.product.is_digital,
            isPersonalized: transaction.is_personalizable,
            productId: String(transaction.listing_id),
            productVariantId: String(transaction.product.product_id),
            sku: transaction.product.product_identifier,
            title: transaction.product.title,
            image: transaction.product.image_url_75x75.replace(
               "il_75x75",
               "il_fullxfull"
            ),
            isDigital: transaction.product.is_digital,
            price: transaction.cost.value / 100,
            shippingCost: 0,
            attributes: [],
            personalized: [],
         };
         for (const variation of transaction.variations) {
            if (variation.property === "Personalization") {
               newItem.personalized.push({
                  name: variation.property,
                  value: variation.value,
               });
            } else {
               newItem.attributes.push({
                  name: variation.property,
                  value: variation.value,
               });
            }
         }
         newOrder.items.push(newItem);
      }
      orders.push(newOrder);
   }
   return orders;
};

const sendRequestToMB = async (endPoint, apiKey, data) => {
   const res = {
      data: null,
      error: null,
   };
   const url = endPoint ? MBUrl.replace("/query", endPoint) : MBUrl;
   try {
      const resp = await fetch(url, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${apiKey}`,
         },
         body: data,
      });
      return await resp.json();
   } catch (error) {
      res.error = error.message;
   }
   return res;
};

// capture event from content script
chrome.runtime.onMessage.addListener(async (req, sender, res) => {
   const { message, data } = req || {};
   if (message === "syncOrderToMB") {
      const { apiKey, orders } = data;
      if (!apiKey || !orders || !orders.length) return;
      let query = JSON.stringify({
         operationName: "createEtsyOrder",
         variables: {
            input: orders,
         },
         query: "mutation createEtsyOrder($input: [NewEtsyOrder!]!) {createEtsyOrder(input: $input){error}}",
      });
      const result = await sendRequestToMB(null, apiKey, query);
      const resp = {
         orders,
         data: result.data ? result.data.createEtsyOrder : null,
         error: result.errors ? result.errors[0].message : null,
      };
      sendMessage(sender.tab.id, "syncOrderToMB", resp);
   }
   if (message === "deleteIgnoreOrder") {
      const { apiKey, orders } = data;
      if (!apiKey || !orders || !orders.length) return;
      let query = JSON.stringify({
         operationName: "deleteIgnoreEtsyOrder",
         variables: {
            originOrderIds: orders.map((o) => o.orderId),
         },
         query: "mutation deleteIgnoreEtsyOrder($originOrderIds: [ID!]!) {deleteIgnoreEtsyOrder(originOrderIds: $originOrderIds)}",
      });
      const result = await sendRequestToMB(null, apiKey, query);
      const resp = {
         orders,
         data: result.data ? result.data.deleteIgnoreEtsyOrder : null,
         error: result.errors ? result.errors[0].message : null,
      };
      sendMessage(sender.tab.id, "deleteIgnoreEtsyOrder", resp);
   }
});

// capture event from popup
chrome.runtime.onMessage.addListener(async (req, sender, res) => {
   const { message, data } = req || {};
   switch (message) {
      case "popupSaveApiKey":
         sendToContentScript("popupSaveApiKey", data);
         break;
      case "popupGetApiKey":
         sendToContentScript("popupGetApiKey", null);
      default:
         break;
   }
});

// capture event from devtool
chrome.runtime.onConnect.addListener(function (port) {
   if (port.name !== "captureOrders") return;
   port.onMessage.addListener(async (msg) => {
      const { message, data } = msg || {};
      switch (message) {
         case "orderInfo":
            if (!data) break;
            const orders = getOrders(data);
            const resp = {
               orders,
               mbInfos: {},
               error: null,
            };

            if (orders.length === 0) {
               sendToContentScript("orders", resp);
               return;
            }
            // check synced orders
            const mbApiKey = await getMBApiKey();
            if (!mbApiKey) return;
            const query = JSON.stringify({
               query: `
                  query{
                     checkEtsyOrderSyncedByIds(
                        ids: ${JSON.stringify(orders.map((o) => o["orderId"]))}
                     )
                  }
            `,
            });
            const result = await sendRequestToMB(null, mbApiKey, query);
            resp.mbInfos = result.data
               ? result.data.checkEtsyOrderSyncedByIds
               : null;
            resp.error = result.errors ? result.errors[0].message : null;

            sendToContentScript("orders", resp);
            break;
         default:
            break;
      }
   });
});

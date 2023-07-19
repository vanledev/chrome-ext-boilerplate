const mbApi = "MBApi";
const addonCollapsible = "AddonCollapsible";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const setCookie = (name, value) => {
   let cookie = name + "=" + encodeURIComponent(value);
   cookie += "; max-age=" + 365 * 24 * 60 * 60;
   document.cookie = cookie;
};

const getCookie = (name) => {
   const cookieArr = document.cookie.split(";");
   for (var i = 0; i < cookieArr.length; i++) {
      const cookiePair = cookieArr[i].split("=");
      if (name == cookiePair[0].trim()) {
         return decodeURIComponent(cookiePair[1]);
      }
   }
   return null;
};

const notifySuccess = (message) => {
   $.toast({
      heading: message,
      position: "bottom-center",
      showHideTransition: "slide",
      loader: false,
      textAlign: "center",
   });
};

const notifyError = (message) => {
   $.toast({
      heading: message,
      position: "bottom-center",
      showHideTransition: "slide",
      loader: false,
      textAlign: "center",
      bgColor: " #d82c0d",
   });
};

const checkAddonCollapse = async () => {
   const isOpen = getCookie(addonCollapsible);
   if (isOpen === false) {
      if ($("#om-collapsible").hasClass("om-active"))
         $("#om-collapsible").click();
   } else {
      if (!$("#om-collapsible").hasClass("om-active"))
         $("#om-collapsible").click();
   }
};

const addonComponent = `
   <div class="om-addon">
      <div class="om-container">
         <button type="button" id="om-collapsible" class="om-btn">
            <svg
               aria-hidden="true"
               focusable="false"
               data-prefix="fas"
               data-icon="angle-double-right"
               style="width: 18px"
               class="svg-inline--fa fa-angle-double-right fa-w-14"
               role="img"
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 448 512"
            >
               <path
                  fill="currentColor"
                  d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"
               ></path>
            </svg>
         </button>
         <div class="content">
            <div class="om-tab">
               <button class="tablinks om-tablinks" data-name="sync_order">
                  Sync Order
               </button>
               <button class="tablinks om-tablinks" data-name="add_tracking">
                  Add Tracking
               </button>

               <button class="tablinks om-tablinks" data-name="settings">
                  Settings
               </button>
            </div>

            <div id="sync_order" class="tabcontent om-tabcontent"></div>

            <div id="add_tracking" class="tabcontent om-tabcontent">
               <div class="om-fl-center om-mgt-15 btn-add-tracking-wrap">
                  <button id="add-trackings" class="om-btn">Add Trackings</button>
               </div>
            </div>
            <div id="settings" class="tabcontent om-tabcontent">
               <div class="settings_body">
                  <div>
                     <input type="checkbox" id="currency-convert">
                     <label for="currency-convert">Currency convert</label>
                  </div>
                  <div class="settings_group_input">
                     <div class="left">
                        <input type="number" value="1" disabled />
                        <span class="input-addon-suffix">$</span>
                     </div>
                     <span class="equal">=</span>
                     <div class="right">
                        <input type="number" min="0" id="change-result"/>
                     </div>
                  </div>
                  <div>
                     <button type="button" id="save-settings">Save</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
`;

const syncOrderComponent = `
   <div class="sync-order-wrap">
      <h3 style="text-align:center;" >Orders Statistic</h3>
      <div class="om-tab">
         <button class="tablinks" data-name="not_synced">Not Synced</button>
         <button class="tablinks" data-name="ignored">Ignored</button>
      </div>
      <div id="not_synced" class="tabcontent">
         <div class="om-fl-center om-mgt-15 btn-sync-order-wrap">
            <button id="sync-order" class="om-btn">Sync Orders</button>
         </div>
      </div>
      <div id="ignored" class="tabcontent">
         <div class="om-fl-center om-mgt-15 btn-revert-order-wrap">
            <button id="revert-order" class="om-btn">Revert Orders</button>
         </div>
      </div>
   </div>
`;

const initAddon = async () => {
   // embedding addon into etsy
   if (!window.location.href.includes("/your/orders/sold")) return;
   // check has api token
   const apiKey = getCookie(mbApi);
   if (!apiKey || !apiKey.includes("etsyapi")) {
      notifyError("Please enter MB api key.");
      return;
   }
   if ($(".om-addon").length) return;
   $("body").append(addonComponent);
   await checkAddonCollapse();

   // active tab sync order
   $('[data-name="sync_order"]').click();
   $("#sync_order").append(syncOrderComponent);
   $(".btn-sync-order-wrap").css("display", "none");
   $(".btn-revert-order-wrap").css("display", "none");
   $(".btn-add-tracking-wrap").css("display", "none");

   // loading tabs until receive orders
   $("#not_synced").prepend(
      `<div style="position:relative;height:100px" class="loader-resp"></div>`
   );
   $("#ignored").prepend(
      `<div style="position:relative;height:100px" class="loader-resp"></div>`
   );
   $("#add_tracking").prepend(
      `<div style="position:relative;height:100px" class="loader-resp"></div>`
   );
   // active tab not synced
   $('[data-name="not_synced"]').click();
};

const b64Encode = (obj) => {
   const strObj = JSON.stringify(obj);
   return btoa(unescape(encodeURIComponent(strObj)));
};

const b64Decode = (b64String) => {
   const objStr = decodeURIComponent(escape(window.atob(b64String)));
   return JSON.parse(objStr);
};

// collapse
$(document).on("click", "#om-collapsible", function () {
   this.classList.toggle("om-active");
   var content = this.nextElementSibling;
   if (content.style.width) {
      content.style.width = null;
      setTimeout(() => {
         content.style.height = null;
         content.style.padding = null;
      }, 300);
   } else {
      content.style.width = "500px";
      content.style.height = "auto";
   }
   if ($(this).hasClass("om-active")) setCookie(addonCollapsible, true);
   else setCookie(addonCollapsible, false);
});

// open tabs
$(document).on("click", `.om-tablinks`, function (e) {
   $(".om-tabcontent").each(function () {
      $(this).css("display", "none");
   });
   $(".om-tablinks").each(function () {
      $(this).removeClass("om-active om-active-tab");
   });
   $(`#${$(this).attr("data-name")}`).css("display", "block");
   $(this).addClass("om-active om-active-tab");
});

// capture event from background
chrome.runtime.onMessage.addListener(async function (req, sender, res) {
   const { message, data } = req || {};
   switch (message) {
      case "getApiKey":
         res({ message: "received" });
         chrome.runtime.sendMessage({
            message: "getApiKey",
            data: getCookie(mbApi),
         });
         break;
      default:
         break;
   }
});

// capture event from popup
chrome.runtime.onMessage.addListener(async function (req, sender, res) {
   const { message, data } = req || {};
   switch (message) {
      case "popupSaveApiKey":
         res({ message: "received" });
         setCookie(mbApi, data);
         initAddon();
         chrome.runtime.sendMessage({
            message: "listedSaveApiKey",
            data: getCookie(mbApi),
         });
         break;
      case "popupGetApiKey":
         res({ message: "received" });
         chrome.runtime.sendMessage({
            message: "popupGetApiKeyValue",
            data: getCookie(mbApi),
         });
         break;
      default:
         break;
   }
});

$(document).ready(function () {
   initAddon();
});

const mbApi = "MBApi";
const saveMbApi = (apiKey) =>
   new Promise((r) =>
      chrome.storage.local.set({ [mbApi]: apiKey }).then(() => {
         r(apiKey);
      })
   );
const getMbApi = () =>
   new Promise((r) =>
      chrome.storage.local.get(mbApi).then((result) => {
         r(result[mbApi]);
      })
   );
const removeMbApi = () =>
   new Promise((r) =>
      chrome.storage.local.remove(mbApi).then((result) => {
         r(result);
      })
   );

$(document).on("click", "#save", async function () {
   const value = $("#api_key").val();
   if (!value.includes("etsyapi")) {
      alert("Invalid api key");
      return;
   }
   $(this).addClass("loader");
   await removeMbApi();
   await saveMbApi(value);
   chrome.runtime.sendMessage({
      message: "saveApiKey",
      data: value,
   });
});

async function checkApiKey() {
   const key = await getMbApi();
   if (key) $("#api_key").val(key);
}

$(document).ready(function () {
   checkApiKey();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.massage === "listedSaveApiKey") window.close();
});

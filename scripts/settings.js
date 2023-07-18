$(document).ready(function () {
   $("#save-settings").on("click", function () {
      const checked = $("#currency-convert").is(":checked");
      const value = $("#change-result").val();

      notifySuccess("Settings success.")
      setCookie("currencyConvert", JSON.stringify({ checked, value }));
   });
});

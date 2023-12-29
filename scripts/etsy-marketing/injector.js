console.log("injector");
var s = document.createElement("script");
s.src = chrome.runtime.getURL("scripts/etsy-marketing/injected.js");
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

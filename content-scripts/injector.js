console.log("injector");
var s = document.createElement("script");
s.src = chrome.runtime.getURL("injected/main.js");
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

const l = document.createElement("link");
l.rel = "stylesheet";
l.type = "text/css";
l.href = chrome.runtime.getURL("injected/ext.css");
(document.head || document.documentElement).appendChild(l);

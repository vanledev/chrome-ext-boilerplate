console.log("injector");
var s = document.createElement("script");
s.src = chrome.runtime.getURL("injected/injected.js");
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

var s2 = document.createElement("script");
s2.src = chrome.runtime.getURL("injected/jquery.min.js");
(document.head || document.documentElement).appendChild(s2);

const l = document.createElement("link");
l.rel = "stylesheet";
l.type = "text/css";
l.href = chrome.runtime.getURL("injected/ext.css");
(document.head || document.documentElement).appendChild(l);

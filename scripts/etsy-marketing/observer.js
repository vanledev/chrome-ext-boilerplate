const observer = new MutationObserver(function (mutationsList, observer) {
  console.log(mutationsList);
});
observer.observe(document.getElementById("root"), {
  attributes: false,
  childList: true,
  subtree: false,
});
// Later, you can disconnect the observer when you no longer need it
// observer.disconnect();

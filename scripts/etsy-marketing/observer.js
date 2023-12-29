
const targetNode = document.getElementById('myElement');
const config = { attributes: true, childList: false, subtree: false };
const callback = function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'attributes') {
      console.log('Attribute ' + mutation.attributeName + ' changed');
    }
  }
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
// Later, you can disconnect the observer when you no longer need it
// observer.disconnect();
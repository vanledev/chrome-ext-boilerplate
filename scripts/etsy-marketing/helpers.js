function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

async function retryFunctionWithDelay(childFunction, count, delay) {
  let attempts = 0;

  while (true) {
    const res = await childFunction();
    console.log(attempts);
    if (res == true || attempts > count) break;
    attempts++;

    await sleep(delay);
  }

  return true;
}
function removeDoubleEle(selector) {
  if ($(selector).length > 1) {
    for (let i = 0; i < $(selector).length - 1; i++) {
      $($(selector)[i]).remove();
    }
  }
}

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
  $(selector + ":not(:last)").remove();
}

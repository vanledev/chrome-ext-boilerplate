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
  let res;
  while (true) {
    res = await childFunction();
    // console.log(attempts, res, childFunction);
    if (res !== false || attempts > count) break;
    attempts++;

    await sleep(delay);
  }

  return res;
}
function removeDoubleEle(selector) {
  $(selector + ":not(:last)").remove();
}

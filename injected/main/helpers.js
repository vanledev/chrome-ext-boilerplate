function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function stopInteval  (params)  {
  clearInterval(params);
};

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
    const res = childFunction();
    if (res == true || attempts > count) break;
    attempts++;
    await sleep(delay);
  }
}

// async function fn1() {
//   return 1;
// }
// async function fn2() {
//   return x;
// }
// promiseAll(fn1, fn2);
async function promiseAll(...fns) {
  const promises = fns.map((fn) => fn());

  const res = await Promise.allSettled(promises);
  if (res) {
    debug.dev("all settled", res);
    return res;
  }
}

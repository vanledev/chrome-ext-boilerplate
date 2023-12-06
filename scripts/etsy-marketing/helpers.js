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
    console.log(attempts);
    const res = childFunction();
    if (res == true || attempts > count) break;
    attempts++;
    await sleep(delay);
  }
  console.log("Done retry function");
  return true;
}

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForElement(selector, count, delay) {
  let attempts = 0;
  while (true && attempts < count) {
    attempts++;
    const ele = $(selector);
    console.log("ele", ele);
    if (ele.length !== 0) {
      return ele;
    } else {
      await sleep(delay);
    }
  }
  return false;
}
async function waitForVar(variable, count = 10, delay = 1000) {
  let attemp = 0;
  while (true && attemp < count) {
    if (variable) {
      return variable;
    } else {
      attemp++;
      await sleep(delay);
    }
  }
  return false;
}

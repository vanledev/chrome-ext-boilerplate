// inject();

async function inject() {
  try {
    await loadScript("assets/libs/jquery.min.js");
    await loadScript("scripts/etsy-marketing/sort/injected-for-sort.js");
    console.log(
      "Injected Scripts for sorting function have been successfully loaded."
    );
  } catch (error) {
    console.error("Error loading injected scripts for sorting:", error);
  }
}

async function loadScript(url) {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${chrome.runtime.getURL(url)}"]`
    );

    if (existingScript) {
      // If the script is already present, remove it
      existingScript.parentNode.removeChild(existingScript);
    }
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL(url);
    script.onload = resolve;
    script.onerror = reject;
    (document.head || document.documentElement).appendChild(script);
  });
}

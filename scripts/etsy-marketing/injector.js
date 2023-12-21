inject();

async function inject() {
  try {
    // Load jQuery
    loadStyle("scripts/etsy-marketing/injected/injected.css");
    await loadScript("assets/libs/jquery.min.js");

    // jQuery has been loaded, now load the main script
    await loadScript("scripts/etsy-marketing/injected/ads-injected.js");

    // The main script has been loaded
    console.log("Scripts have been successfully loaded.");
  } catch (error) {
    console.error("Error loading scripts:", error);
  }
}

// Call the function to load scripts

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
async function loadStyle(url) {
  return new Promise((resolve, reject) => {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.href = chrome.runtime.getURL(url);
    style.onload = resolve;
    style.onerror = reject;
    (document.head || document.documentElement).appendChild(style);
  });
}

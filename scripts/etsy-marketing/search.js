// Wait to the button that show keywords to appear in DOM, then addEventListener to it
if (
  window.location.href.includes("etsy.com/your/shops/me/advertising/listings")
) {
  retryFunctionWithDelay(addSearch, 10, 1000);
}

function addSearch() {
  const button = $("[aria-controls*='wt-content-toggle']")[0];
  if (button) {
    button.addEventListener("click", () => {
      
    });

    return true;
  } else {
    return false;
  }
}

function search(event) {
  // Your data array

  // Perform a search
  const query = event.target.value;
  console.log(query);
  const result = fuse.search(query);

  
  console.log(result);
 
    tableRows.each(function () {
      const searchText = $(this)
        .find("th")
        .contents()
        .filter(function () {
          return this.nodeType === 3; // Filter out non-text nodes
        })
        .text()
        .trim()
        .slice(1, -1);
      $(this).toggle(currentKeywordsPool.has(searchText));
    });
 
}

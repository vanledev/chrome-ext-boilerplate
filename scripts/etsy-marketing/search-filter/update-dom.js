function updateDOMTable(keywordsShouldShow) {
  document.querySelector("#om-table-loading").classList.remove("hide-loading");
  debugger;
  $("#countRows").html(keywordsShouldShow.length);

  // Now 'table' variable contains the reference to the desired table.
  console.time(1);
  $(keywordTableSelector + " tbody tr").each(function () {
    const keywordInRow = $(this)
      .find("th")
      .contents()
      .filter(function () {
        return this.nodeType === 3;
      })
      .text()
      .trim()
      .slice(1, -1);

    $(this).toggle(keywordsShouldShow.includes(keywordInRow));
  });
  console.timeEnd(1);
  $("#om-table-loading").addClass("hide-loading");
  
}

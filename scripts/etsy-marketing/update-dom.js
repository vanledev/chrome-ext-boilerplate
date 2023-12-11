function resetSearchForm() {
  $("#searchForm").val("");
}

function updateDOMTable(keywordsShouldShow) {
  $("#countRows").html(keywordsShouldShow.length);

  // Now 'table' variable contains the reference to the desired table.

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
}

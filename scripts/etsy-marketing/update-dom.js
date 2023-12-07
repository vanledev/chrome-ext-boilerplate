

function resetSearchForm() {
  $("#searchForm").val("");
}

function updateTable(keywordsShouldShow) {
  $("#countRows").html(keywordsShouldShow.length);
  tableRows.each(function () {
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

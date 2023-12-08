function resetSearchForm() {
  $("#searchForm").val("");
}

function updateTable(keywordsShouldShow) {
  console.log("update table with keywords should show ", keywordsShouldShow);

  $("#countRows").html(keywordsShouldShow.length);
  $($(keywordTableSelector + " tbody tr")).each(function () {
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

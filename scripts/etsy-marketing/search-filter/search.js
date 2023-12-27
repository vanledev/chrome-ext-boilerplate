function changeKeywordResult() {
  let searchText = $("#searchForm").val();
  console.log(searchText);
  if (searchText === "") {
    updateCurrentKeywordsPool();

    updateDOMTable(currentKeywordsPool);
  } else {
    const searchOption = getSearchOption();

    let fuseResult;
    switch (searchOption) {
      case "contain":
        fuseResult = fuse.search(searchText);

        break;
      case "exclude":
        fuseResult = fuse.search("!" + searchText);
        break;
    }

    let arr = fuseResult.map((item) => item.item);

    updateDOMTable(arr);
  }
  
}

function onChangeSearchForm(event) {
  let searchText = event.target.value;
  if (searchText === "") {
    // Input is cleared, do something
    console.log("Input is cleared!");
    changeCurrentKeywordsPool();
    updateTable(currentKeywordsPool);
  } else {
    console.log("searchText is ", searchText);
    console.log("fuse before la", fuse);
    const result = fuse.search(searchText);
    console.log("fuse after la", fuse);
    const arr = result.map((item) => item.item);

    updateTable(arr);
  }
}

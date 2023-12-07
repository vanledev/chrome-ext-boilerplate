function onChangeSearchForm(event) {
  let searchText = event.target.value;
  if (searchText === "") {
    updateCurrentKeywordsPool();
    updateTable(currentKeywordsPool);
  } else {
    const result = fuse.search(searchText);
    const arr = result.map((item) => item.item);
    updateTable(arr);
  }
}

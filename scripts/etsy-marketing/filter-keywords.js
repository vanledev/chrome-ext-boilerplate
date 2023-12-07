function onChangeFilter() {
  resetSearchForm();

  updateCurrentKeywordsPool();

  updateTable(currentKeywordsPool);
}

function onChangeFilter() {
  changeCurrentKeywordsPool();
  updateTable(currentKeywordsPool);
  resetSearchForm();
  // reAssignTableRows(); khiến mỗi lần click chọn Enabled and Disabled lại ko cập nhật được nữa
}



// function printRow({
//   word,
//   views,
//   clicks,
//   clicksLabel,
//   orders,
//   orderLabel,
//   relevantKeyword,
// }) {
//   const clickLabelString = clicksLabel
//     ? `<span class="wt-badge wt-m-xs-2 wt-badge--notificationTertiary">High</span>`
//     : "";
//   return `<tr class="wt-table__row"><th class="wt-table__row__cell wt-no-wrap wt-pl-xs-2 wt-width-auto-lg wt-width-full-xs" scope="row"><div class="wt-table--responsive__title">Buyers searched for</div>"${word}"</th><td class="wt-table__row__cell wt-pr-lg-3 wt-text-left-xs wt-text-right-lg wt-pl-xs-2 wt-pl-lg-0"><div class="wt-table--responsive__title">Views</div>${views} </td><td class="wt-table__row__cell wt-text-left-xs wt-text-right-lg wt-pl-lg-6 wt-pr-xs-0 wt-mr-xs-0"><div class="wt-table--responsive__title">Clicks</div><p>${clicks}</p></td><td class="wt-table__row__cell wt-text-left-xs"><div class="wt-table--responsive__title"></div>

//   ${clickLabelString}

//   </td><td class="wt-table__row__cell wt-text-left-xs wt-text-right-lg wt-pl-lg-6 wt-pr-xs-0 wt-mr-xs-0"><div class="wt-table--responsive__title">Orders</div><p>${orders}</p></td><td class="wt-table__row__cell wt-text-left-xs"><div class="wt-table--responsive__title"></div></td><td class="wt-table__row__cell wt-pr-lg-3 wt-text-left-xs wt-text-right-lg wt-pl-xs-2 wt-pl-lg-0"><div class="wt-table--responsive__title">Relevant keyword</div><div class="wt-switch__wrapper"><div class="wt-switch__frame"><input type="checkbox" id="wt-switch-14bf66be-87fd-44fb-9854-f7697ab878af" class="wt-switch wt-switch--small"><label for="wt-switch-14bf66be-87fd-44fb-9854-f7697ab878af" class="wt-switch__toggle"><span class="wt-screen-reader-only">Relevant keyword</span></label></div></div></td></tr>`;
// }

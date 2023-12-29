async function showNoti(type) {
  const placeForNoti = $("#wt-toast-feed");
  const notiContent = {
    toggleKeywordSuccess: `<div class="wt-toast wt-toast--success-01" style="opacity: 1; transform: none;"><span class="wt-toast__icon-frame"><span class="wt-screen-reader-only">Success</span><span class="etsy-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">  <path d="M9.057 20.47l-6.764-6.763a1 1 0 011.414-1.414l5.236 5.236 11.3-13.18a1.001 1.001 0 111.518 1.3L9.057 20.47z"></path></svg></span></span><p>Thanks for sharing your feedback!</p><div class="wt-toast__actions"><button type="button" class="wt-btn wt-btn--transparent wt-btn--icon wt-btn--light" aria-labelledby=" wt-tooltip-42ad2ed5-e232-43b4-ba0b-eb9c77475994" aria-describedby=""></button></div></div>`,
  };
  placeForNoti.html(notiContent[type]);
  placeForNoti.fadeIn().delay(2000).fadeOut();
}

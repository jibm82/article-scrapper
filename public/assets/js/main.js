$(document).ready(() => {
  $(".articles").masonry({
    itemSelector: ".article",
    columnWidth: ".article-sizer",
    percentPosition: true
  });
});

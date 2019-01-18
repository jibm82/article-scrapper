$(document).ready(() => {
  let $grid = $(".articles").masonry({
    itemSelector: ".article",
    columnWidth: ".article-sizer",
    percentPosition: true
  });

  $grid.imagesLoaded().progress(() => {
    $grid.masonry("layout");
  });

  $(document).on("click", ".article a", function(e) {
    e.preventDefault();
    const id = $(this)
      .closest(".article")
      .data("id");
    $.post(
      "/api/articles/favourite",
      {
        id
      },
      response => {
        console.log(response);
      }
    );
  });
});

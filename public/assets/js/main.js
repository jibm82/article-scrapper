$(document).ready(() => {
  $(".articles").masonry({
    itemSelector: ".article",
    columnWidth: ".article-sizer",
    percentPosition: true
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

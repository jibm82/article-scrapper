$(document).ready(() => {
  let $grid = $(".articles").masonry({
    itemSelector: ".article",
    columnWidth: ".article-sizer",
    percentPosition: true
  });

  $grid.imagesLoaded().progress(() => {
    $grid.masonry("layout");
  });

  $(document).on("click", ".favorite-toggler", function(e) {
    e.preventDefault();
    const trigger = $(this);
    const icon = trigger.find("i");
    const favorite = trigger.data("favorite");
    const id = trigger.data("id");
    const method = favorite ? "unfavourite" : "favourite";

    $.post(`/api/articles/${method}`, { id }, response => {
      trigger.data("favorite", !favorite);
      icon.toggleClass("fa").toggleClass("far");
    });
  });
});

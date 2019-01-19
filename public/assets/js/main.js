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

  $(document).on("click", ".scrappe", function(e) {
    e.preventDefault();
    const trigger = $(this);
    if (!trigger.hasClass("disabled")) {
      $(".scrappe").addClass("disabled");
      $.get(`/scrappe`, response => {
        if (response.articles && response.articles.length > 0) {
          window.location.reload();
        } else {
          Swal("Scrapping completed", "There are no new articles", "info");
        }
      })
        .fail(() => {
          Swal("Error scrapping", "Please try again later", "error");
        })
        .always(() => {
          $(".scrappe").removeClass("disabled");
        });
    }
  });

  $(document).on("click", "img", function(e) {
    e.preventDefault();
    Swal("h");
  });
});

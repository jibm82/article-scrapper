$(document).ready(() => {
  let $grid = $(".articles").masonry({
    itemSelector: ".article",
    columnWidth: ".article-sizer",
    percentPosition: true,
    horizontalOrder: true
  });

  $grid.imagesLoaded().progress(() => {
    $grid.masonry("layout");
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

  $(document).on("submit", ".new-note", function(e) {
    e.preventDefault();
    const $form = $(this);
    const articleId = $form.data("id");
    const content = $(this)
      .find("input")
      .val()
      .trim();

    if (!$form.hasClass(".disabled") && content !== "") {
      $form.addClass("disabled");

      $.post(`/api/articles/${articleId}/notes`, { content }, response => {
        renderNewNote(articleId, response);
        updateNotesTogglerText(articleId);
        $form.find("input").val("");
      }).always(() => {
        $form.removeClass("disabled");
      });
    }
  });

  $(document).on("click", ".remove", function(e) {
    e.preventDefault();
    const $trigger = $(this);
    const $note = $(this).closest(".article-note");
    const $notes = $(this).closest(".article-notes");
    const articleId = $notes.data("id");
    const noteId = $note.data("id");
    const url = `/api/notes/${noteId}`;

    $.ajax({ method: "DELETE", url }).done(function(response) {
      console.log(response);
      $trigger.closest(".article-note").remove();
      updateNotesTogglerText(articleId);
      $grid.masonry("layout");
    });
  });

  $(document).on("shown.bs.collapse", ".article-notes-body", function(e) {
    $(this)
      .find("input")
      .focus();
    $grid.masonry("layout");
  });

  $(document).on("hidden.bs.collapse", ".article-notes-body", function(e) {
    $grid.masonry("layout");
  });

  function renderNewNote(articleId, noteData) {
    const $notes = $(`#article-notes-body-${articleId}`).find(".article-notes");
    const $note = $("<div>", {
      class: "article-note",
      "data-id": noteData._id
    });

    $note.append($("<p>").text(noteData.content));

    const $button = $("<button>", { class: "btn btn-link btn-sm remove" });
    $button.append($("<i>", { class: "fa fa-trash" }));
    $note.append($button);

    $notes.append($note);
    $grid.masonry("layout");
  }

  function updateNotesTogglerText(articleId) {
    const $toggler = $(`#notes-toggler-${articleId}`);
    const $notes = $(`#article-notes-body-${articleId}`).find(".article-notes");
    const notesCount = $notes.find(".article-note").length;

    if (notesCount > 0) {
      $toggler.text(`Notes (${notesCount})`);
    } else {
      $toggler.text("Add a note");
    }
  }
});

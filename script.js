document.addEventListener("DOMContentLoaded", function () {
    // Seleccionar los botones específicos que deben llevar a book.html
    var buttons = document.querySelectorAll(".btn-primary, .btn-secondary, .service-tags button");

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            window.location.href = "book.html";
        });
    });
});


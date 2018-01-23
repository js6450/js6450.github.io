$(document).ready(function () {

    $('.mdl-cell').each(function () {
       $(this).hover(function() {
           $(this).children().filter('.b-head').toggleClass('show-desc');
       });
    });
});
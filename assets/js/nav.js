var nav;

$('.nav-exit').on('click', function(evt) {
    var url = $(this).attr("href");
    $("nav, footer").addClass('animated slideOutLeft');
    $("main").addClass('animated slideOutRight');
    setTimeout(function() {
        window.location = url;
    }, 1000);
    evt.preventDefault();
});

export default nav;
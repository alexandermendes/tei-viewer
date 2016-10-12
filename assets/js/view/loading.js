window.loading = {'hide': null, 'text': null};

loading.hide = function() {
    $("#loading").fadeOut(),
    window.setTimeout(function() {
        $("nav, main, footer").show();
        $("nav, footer").addClass('animated slideInLeft');
        $("main").addClass('animated slideInRight');
        window.scrollTo(0, 0);
    }, 400);
}

loading.text = function(text) {
    setTimeout(function() {
        $('#loading-text').text(text);
    }, 100);

}

export default window.loading;
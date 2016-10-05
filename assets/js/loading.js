window.loading = {'hide': null, 'text': null};

loading.hide = function() {
    $("#loading").fadeOut(),
    window.setTimeout(function() {
        $("nav, main, footer").show();
        $("nav, footer").addClass('animated slideInLeft');
        $("main").addClass('animated slideInRight');
    }, 400);
}

loading.text = function(text) {
    $('#loading-text').text(text);
}

export default window.loading;
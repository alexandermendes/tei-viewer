window.loading = {'hide': null, 'show': null};

loading.hide = function() {
    $("#loading").fadeOut('fast');
    $("nav, main, footer").removeClass('invisible');
    $("nav, footer").addClass('animated slideInLeft');
    $("main").addClass('animated slideInRight');
}

export default window.loading;
window.loading = {'hide': null, 'show': null};

loading.hide = function() {
    $("#loading").hide();
    $("main").show();
}

loading.show = function() {
    $("main").hide();
    $("#loading").show();
}

export default window.loading;
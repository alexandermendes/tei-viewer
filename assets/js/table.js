/** Populate the hide, show and sort menus. */
function populateTableMenus() {
    var headings = []
    $('table th').each(function(i) {
        var h = {'label': $(this).html(), 'visible': $(this).is(':visible'),
                 'index': i}
        headings.push(h);
    });

    if ($('table th:visible').length > 0) {
        $( "#hide-menu" ).load( "_snippets.html #thead-li-template", function() {
            var template = $('#thead-li-template').html();
            function getCls() {
                return (this.visible) ? "hide-column" : "hide-column hidden";
            }
            var rendered = Mustache.render(template, {cls: getCls,
                                           headings: headings});
            $('#thead-li-template').remove();
            $("#hide-menu").append(rendered);
        });
    } else {
        $( "#hide-menu" ).load( "_snippets.html #option-ph-template", function() {
            var template = $('#option-ph-template').html();
            var rendered = Mustache.render(template, {label: "Nothing to hide"});
            $('#option-ph-template').remove();
            $("#hide-menu").append(rendered);
        });
    }

    if ($('table th:hidden').length > 0) {
        $( "#show-menu" ).load( "_snippets.html #thead-li-template", function() {
            var template = $('#thead-li-template').html();
            function getCls() {
                return (!this.visible) ? "show-column" : "show-column hidden";
            }
            var rendered = Mustache.render(template, {cls: getCls,
                                           headings: headings});
            $('#thead-li-template').remove();
            $("#show-menu").append(rendered);
        });
    } else {
        $( "#show-menu" ).load( "_snippets.html #option-ph-template", function() {
            var template = $('#option-ph-template').html();
            var rendered = Mustache.render(template, {label: "Nothing to show"});
            $('#option-ph-template').remove();
            $("#show-menu").append(rendered);
        });
    }
}


/** Hide a table column. */
function hideColumn(i) {
    $('table tr > *:nth-child(' + i + ')').hide();
    populateTableMenus();
}


/** Hide column menu item clicked. */
$( "#hide-menu" ).on('click', '.hide-column', function(e) {
    var index = parseInt($(this).attr('data-index')) + 1;
    hideColumn(index);
    e.preventDefault();
});


/** Show a table column. */
function showColumn(i) {
    $('table tr > *:nth-child(' + i + ')').show();
    populateTableMenus();
}


/** Show column menu item clicked. */
$( "#show-menu" ).on('click', '.show-column', function(e) {
    var index = parseInt($(this).attr('data-index')) + 1;
    showColumn(index);
    e.preventDefault();
});


/** Return an array of currently hidden indexes. */
function getHiddenColumns(){
    var hiddenCols = [];
    $('table th').each(function(k, v) {
        if ($(this).is(':hidden')) {
            hiddenCols.push(k + 1);
        }
    });
    return hiddenCols;
}

/** Populate the hide, show and sort menus. */
function populateTableMenus() {
    var headings = []
    $('table th').each(function(i) {
        var h = {'label': $(this).html(), 'visible': $(this).is(':visible'),
                 'index': i}
        headings.push(h);
    });

    function renderPlaceholder(id) {
        var template = $("#table-menu-ph-template").html();
            rendered = Mustache.render(template, {label: "Nothing to " + id});
        $("#" + id + "-menu").html(rendered);
    }

    function renderMenu(id, cls) {
        var template = $("#table-menu-template").html();
            rendered = Mustache.render(template, {cls: cls, headings: headings});
        $("#" + id + "-menu").html(rendered);
    }

    function getHideCls() {
        return (this.visible) ? "hide-column" : "hide-column hidden";
    }

    function getShowCls() {
        return (!this.visible) ? "show-column" : "show-column hidden";
    }

    if ($('table th:visible').length > 0) {
        renderMenu('hide', getHideCls)
    } else {
        renderPlaceholder('hide');
    }

    if ($('table th:hidden').length > 0) {
        renderMenu('show', getShowCls)
    } else {
        renderPlaceholder('show');
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


/** Set the table to fixed or otherwise. */
function setTableAsFixed(bool) {
    if (bool) {
        $('#table-scroll').addClass('fixed');
        var tableWidth = $('#table-scroll .table th').length * 300;
        $('#table-scroll .table').css('width', tableWidth);
        $('#table-scroll .table').css('max-width', tableWidth);
    } else {
        $('#table-scroll').removeClass('fixed');
    }
}

var teiTable;
var lastSelected;
var currentPage = 0;


/**
 * Show a view.
 * @param {string} view - The view to show.
 */
function showView(view) {
    $('.view').hide();
    $('#' + view + '-view').show();
    if (view === 'xml') {
        $('#xml-view-menu').show();
        $('#tei-view-menu').hide();
    } else {
        $('#tei-view-menu').show();
        $('#xml-view-menu').hide();
    }
}


/** Refresh the view. */
function refreshView() {
    var perPage = Cookies.getJSON('settings').recordsPerPage;
        xmlDoc   = {};
    if (typeof(teiTable) === 'undefined' || !teiTable.XSLTProcLoaded()) {
        notify('XSLT processor not loaded, please try again.', 'error');
    } else {
        dbServer.tei
            .query()
            .all()
            .limit(currentPage * perPage, perPage)
            .execute()
            .then(function (data) {
                xmlDoc = mergeXMLDocs(data);
                teiTable.populate(xmlDoc, currentPage * perPage);

                dbServer.tei.count().then(function (totalRecords) {
                    paginate(totalRecords);
                    if (totalRecords > 0) {
                        showView('tei');
                    } else {
                        showView('upload');
                    }
                    applySettings();
                }).catch(function (err) {
                    showView('upload');
                    notify(err.message, 'error');
                    throw err;
                });

            }).catch(function (err) {
                showView('upload');
                notify(err.message, 'error');
                throw err;
            });
    }
}


/** Apply settings. */
function applySettings() {
    var settings = Cookies.getJSON('settings');
    teiTable.showBorders(settings.showBorders);
    teiTable.showTooltips(settings.showTooltips);
    teiTable.freezeHeader(settings.freezeHeader);
    teiTable.fixFrozenTable();
}


/**
 * Create a new TEI table and setup it's XSLT processor.
 * @param {object} container - The container for the table.
 */
function createTeiTable(container) {
    var tableXSLT = Cookies.get('xslt') || $('#select-xslt li:first').text();
        table     = new TeiTable(container);
    return Promise.resolve($.ajax({
        url: "assets/xslt/" + tableXSLT
    })).then(function(data) {
        XSLTProc = new XSLTProcessor();
        XSLTProc.importStylesheet(data);
        table.updateXSLTProc(XSLTProc);
        return table;
    }).catch(function() {
        notify('XSLT file ' + tableXSLT + ' could not be loaded, try ' +
               'reverting to default settings.', 'error');
    });
}


/**
 * Return a row as a comma seperated string.
 * @param {object} rowElem - The row element.
 */
function getCommaSeperatedRow(rowElem) {
    var row = [];
    rowElem.find('th,td').each(function () {
        var val = $(this)[0].innerText;
        row.push('"' + val.replace(/"/g, '""') + '"');
    });
    return row.join(',');
}


/**
 * Export a table to CSV.
 * @param {object} tableElem - The table element.
 */
function exportTableToCSV(tableElem) {
    var rows        = [],
        csvFile     = {};
        contentType = 'text/csv';
    var link = document.createElement("a");

    $(tableElem).find('tr').each(function() {
        rows.push(getCommaSeperatedRow($(this)));
    });

    csvFile = new Blob([rows.join("\n")], {type: contentType});

    link.download = 'tei-data.csv';
    link.href = window.URL.createObjectURL(csvFile);
    link.dataset.downloadurl = [contentType, link.download, link.href].join(':');
    link.click();
}


/** Clear selected rows. */
$("#clear-selected").click(function(evt) {
    var pending = $('#tei-view table tr[selected]').length,
        total   = pending;
    evt.preventDefault();
    if (pending > 0) {
        showView("loading");
        $('#tei-view table tr[selected]').each(function() {
            dbServer.tei.remove(parseInt($(this).context.id)).then(function(key) {
                --pending;
                if (pending === 0) {
                    notify(total + ' row' + (total == 1 ? '' : 's') +
                           ' deleted.', 'info');
                    refreshView();
                }
            });
        });
    }
});


/** Clear all rows. */
$("#clear-all").click(function(evt) {
    evt.preventDefault();
    showView("loading");
    currentPage = 0;
    dbServer.tei.clear();
    refreshView();
});


/** Export the table to CSV. */
$("#csv-export").click(function(evt) {
    var div    = $('<div></div>'),
        xmlDoc = {},
        table  = {};
    evt.preventDefault();
    showView('loading');
    notify('Preparing export...', 'info');
    createTeiTable(div).then(function(t){
        table = t;
        dbServer.tei.query().all().execute().then(function (data) {
            setTimeout(function() {
                xmlDoc = mergeXMLDocs(data);

                setTimeout(function() {
                    table.populate(xmlDoc, 0);

                    setTimeout(function() {
                        exportTableToCSV(div.find('table'));
                    }, 100);

                }, 100);

            }, 100);
        }).catch(function (err) {
            notify(err.message, 'error');
            throw err;
        }).then(function(table){
            refreshView();
        });
    });
});


$('#select-xslt li').on('click', function(evt){
    var xslt = $(this).text();
    evt.preventDefault();
    Cookies.set('xslt', xslt);
    createTeiTable($('#tei-view')).then(function(table){
        teiTable = table;
        refreshView();
    });
});


/** Return true if both JSON files contain the same keys, false otherwise.
 *  @param {Object} a - A JSON file.
 *  @param {Object} b - A JSON file.
 */
function compareJSON(a, b) {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) == JSON.stringify(bKeys);
}


/** Load settings. */
function loadSettings(){
    var settings = Cookies.get('xslt');
    createTeiTable($('#tei-view')).then(function(table){
        teiTable = table;
        refreshView();
    });
}


/**
 * Render a link to be used for pagination.
 * @param {number} page - The page number.
 * @param {string} id - The ID to which the template should be prepended.
 */
function renderPaginationTemplate(page, id) {
    var template = $("#pagination-template").html(),
        rendered = Mustache.render(template, {page: page});
    $(id).prepend(rendered);
}


/**
 * Add pagination to footer.
 * @param {number} totalRecords - The total number of records loaded.
 */
function paginate(totalRecords) {
    var perPage    = Cookies.getJSON('settings').recordsPerPage,
        totalPages = Math.ceil(totalRecords / perPage);
    $('#pagination-text').html(totalRecords + ' records loaded');
    if (totalPages > 0) {
        $('#page-selection').bootpag({
                total: totalPages,
                maxVisible: 10
            }).one("page", function(event, num) {
                showView('loading');
                $('#page-selection').html('');
                currentPage = num - 1;
                refreshView();
            });
    } else {
        $('#page-selection').html('');
    }
}



/** Handle click event for hide column menu item. */
$("#hide-menu").on('click', '.hide-column', function(evt) {
    var index   = parseInt($(this).attr('data-index')),
        perPage = Cookies.getJSON('settings').recordsPerPage;
    evt.preventDefault();
    teiTable.hideColumn(index, currentPage * perPage);
    applySettings();
});


/** Handle click event for show column menu item. */
$("#show-menu").on('click', '.show-column', function(evt) {
    var index   = parseInt($(this).attr('data-index')),
        perPage = Cookies.getJSON('settings').recordsPerPage;
    evt.preventDefault();
    teiTable.showColumn(index, currentPage * perPage);
    applySettings();
});


/** Select or deselect table row on click event. */
$("#tei-view").on('click', 'tr:not(a)', function(evt) {
    var selected     = $('#tei-view table tbody tr[selected]'),
        thisSelected = typeof($(this).attr('selected')) !== 'undefined';
    if (evt.target.nodeName === "A" || evt.target.parentNode.nodeName == "A") {
        return;
    }

    // Select a row
    function select(elem) {
        elem.find('td:not(.index-column)').css('background-color', '#eee');
        elem.attr('selected', 'true');
        lastSelected = elem;
    }

    // Deselect a row
    function deselect(elem) {
        elem.find('td:not(.index-column)').css('background-color', '#fff');
        elem.removeAttr('selected');
    }

    if (evt.shiftKey) {
        if (!lastSelected) {
            lastSelected = $('#tei-view table tbody tr').first();
        }
        if (lastSelected.index() < $(this).index()) {
            $(lastSelected.nextUntil(this).andSelf().add(this)).each (function() {
                select($(this));
            });
        } else {
            $($(this).nextUntil(lastSelected).andSelf().add(lastSelected)).each (function() {
                select($(this));
            });
        }
    } else if(evt.ctrlKey || evt.metaKey) {
        if (thisSelected) {
            deselect($(this));
        } else {
            select($(this));
        }
    } else {
        selected.each(function() {
            deselect($(this));
        });
        if (!thisSelected) {
            select($(this));
        }
    }
    if ($('#tei-view table tbody tr[selected]').length < 1) {
        lastSelected = null;
    }
});


/** Apply frozen table header fixes on scroll event. */
$("#tei-view").scroll(function() {
    if (typeof(teiTable) !== 'undefined') {
        teiTable.fixFrozenTable();
    }
});


/** Apply frozen table header fixes on window resize event. */
$(window).resize(function() {
    if (typeof(teiTable) !== 'undefined') {
        teiTable.fixFrozenTable();
    }
});


// Boolean function to convert value to capitalized string
Boolean.prototype.toCapsString = function () {
    return this.toString().charAt(0).toUpperCase() + this.toString().slice(1);
};


// Initialise
$(function() {
    $.ajaxSetup({ cache: false });
    $('[data-toggle="tooltip"]').tooltip();

    createTeiTable($('#tei-view')).then(function(table){
        teiTable = table;
        refreshView();
    });

});

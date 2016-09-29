var teiTable;
var server;
var lastSelected;
var codeEditor;
var currentPage = 0;


// Database options
var dbOptions = {
    server: 'tei-viewer',
    version: 3,
    schema: {
        tei: {
            key: {keyPath: 'id', autoIncrement: true}
        }
    }
};


/**
 * Upload XML files.
 * @param {FileList} files - The files to upload.
 */
function uploadFiles(files) {
    showView('loading');
    var reader  = {},
        pending = files.length;

    /** Save the file to the database. */
    function saveFile(theFile) {
        return function(evt) {
            server.tei.add({
                xml: evt.target.result,
                filename: theFile.name
            }).then(function() {
                pending--;
                if (pending === 0) {
                    notify(files.length + ' file' +
                           (files.length == 1 ? '' : 's') + ' added.',
                           'success');
                    $('.upload-form').trigger("reset");
                    refreshView();
                }
            }).catch(function (err) {
                notify(err.message, 'error');
                throw err;
            });
        };
    }

    for (var i = 0; i < files.length; i++) {
        if (files[i].type !== 'text/xml') {
            notify(f.name + ' is not a valid XML file.', 'warning');
            continue;
        }
        reader = new FileReader();
        reader.onload = saveFile(files[i]);
        reader.readAsText(files[i]);
    }
}


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


/**
 * Remove the XML declaration and add the database ID to an XML document.
 * @param {string} view - The XML string to format.
 * @param {string} id - The database ID of the record.
 */
function preformatXml(xml, id) {
    return xml.replace(/<\?xml.*?\?>/g, "")
              .replace(/<TEI/g, '<TEI id="' + id + '"');
}


/**
 * Return a merged XML document.
 * @param {Array} docs - The data to merge.
 */
function mergeXMLDocs(data) {
    var xmlStr = "<MERGED-TEI>";
    $.each(data, function(i, value) {
        xmlStr = xmlStr.concat(preformatXml(value.xml, value.id));
    });
    xmlStr = xmlStr.concat('</MERGED-TEI>');
    return parseXML(xmlStr);
}


/** Refresh the view. */
function refreshView() {
    var perPage = Cookies.getJSON('settings').recordsPerPage;
        xmlDoc   = {};
    if (typeof(teiTable) === 'undefined' || !teiTable.XSLTProcLoaded()) {
        notify('XSLT processor not loaded, please try again.', 'error');
    } else {
        server.tei
            .query()
            .all()
            .limit(currentPage * perPage, perPage)
            .execute()
            .then(function (data) {
                xmlDoc = mergeXMLDocs(data);
                teiTable.populate(xmlDoc, currentPage * perPage);

                server.tei.count().then(function (totalRecords) {
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
    var tableXSLT = $('#select-xslt').val(),
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
 * Parse and return an XML document.
 * @param {string} xmlStr - The XML string.
 */
function parseXML(xmlStr) {
    var parser = new DOMParser(),
        doc    = parser.parseFromString(xmlStr, 'text/xml');
    if(isParseError(doc)) {
        notify('Failed to parse XML.', 'error');
    }
    return doc;
}


/**
 * Check if an XML document contains a parse error.
 * @param {string} xmlDoc - The XML string.
 */
function isParseError(xmlDoc) {
    var parser = new DOMParser(),
        doc    = parser.parseFromString('<', 'text/xml'),
        ns     = doc.getElementsByTagName("parsererror")[0].namespaceURI;
    if (ns === 'http://www.w3.org/1999/xhtml') {
        return xmlDoc.getElementsByTagName("parsererror").length > 0;
    }
    return xmlDoc.getElementsByTagNameNS(ns, 'parsererror').length > 0;
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


/**
 * Convert a URL to a Blob.
 * @param {string} url - The URL.
 */
function dataURLtoBlob(url) {
    var arr  = url.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}


/** Handle XML save button event */
$("#xml-save").click(function(evt) {
    var recordID = parseInt($('#record-id').html());
    evt.preventDefault();
    server.tei.get(recordID).then(function(result) {
        result.xml = codeEditor.getValue();
        server.tei.update(result).then(function(data){
            showView('loading');
            refreshView();
            notify('Record updated!', 'success');
        }).catch(function (err) {
            notify(err.message, 'error');
            throw err;
        });
    });
});


/** Handle XML download button event */
$("#xml-download").click(function(evt) {
    evt.preventDefault();
    var recordID    = parseInt($('#record-id').html()),
        contentType = 'application/xml',
        link        = document.createElement("a"),
        xmlFile     = {};
    server.tei.get(recordID).then(function(result) {
        xmlFile     = new Blob([codeEditor.getValue()], {type: contentType});
        link.download = result.filename;
        link.href = window.URL.createObjectURL(xmlFile);
        link.dataset.downloadurl = [contentType, link.download, link.href].join(':');
        link.click();
    });
});


/** Clear selected rows. */
$("#clear-selected").click(function(evt) {
    var pending = $('#tei-view table tr[selected]').length,
        total   = pending;
    evt.preventDefault();
    if (pending > 0) {
        showView("loading");
        $('#tei-view table tr[selected]').each(function() {
            server.tei.remove(parseInt($(this).context.id)).then(function(key) {
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
    server.tei.clear();
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
        server.tei.query().all().execute().then(function (data) {
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


/** Reset to default settings. */
$("#reset-settings").click(function(evt) {
    var settings = Cookies.getJSON('settings');
    evt.preventDefault();
    showView("loading");
    $('#settings-modal').modal('hide');
    loadSettings();
    notify('All settings have been reset to their defaults.', 'info');
});


/** Handle change of XSLT setting. */
$("#select-xslt").change(function(evt) {
    var settings    = Cookies.getJSON('settings'),
        defaultXSLT = $('#select-xslt').val();
    evt.preventDefault();
    $.each(settings.xslt, function(index, value) {
        if (value.filename == defaultXSLT) {
            value['default'] = true;
        } else {
            value['default'] = false;
        }
    });
    Cookies.set('settings', settings);
    $('#settings-modal').modal('hide');
    createTeiTable($('#tei-view')).then(function(table){
        teiTable = table;
        refreshView();
    });
});


/** Handle change of show tooltips setting. */
$("#show-tooltips").change('click', function(evt) {
    var settings = Cookies.getJSON('settings'),
        showTips = $('#show-tooltips').val() == 'True';
    evt.preventDefault();
    settings.showTooltips = showTips;
    Cookies.set('settings', settings);
    $('#settings-modal').modal('hide');
    applySettings();
});


/** Handle change of show borders setting. */
$("#show-borders").change('click', function(evt) {
    var settings    = Cookies.getJSON('settings'),
        showBorders = $('#show-borders').val() == 'True';
    evt.preventDefault();
    settings.showBorders = showBorders;
    Cookies.set('settings', settings);
    $('#settings-modal').modal('hide');
    applySettings();
});


/** Handle change of freeze header setting. */
$("#freeze-header").change('click', function(evt) {
    var settings     = Cookies.getJSON('settings'),
        freezeHeader = $('#freeze-header').val() == 'True';
    evt.preventDefault();
    settings.freezeHeader = freezeHeader;
    Cookies.set('settings', settings);
    $('#settings-modal').modal('hide');
    applySettings();
});


/** Handle change of records per page setting. */
$("#n-records").change('click', function(evt) {
    var settings       = Cookies.getJSON('settings'),
        recordsPerPage = parseInt($('#n-records').val());
    evt.preventDefault();
    showView("loading");
    settings.recordsPerPage = recordsPerPage;
    Cookies.set('settings', settings);
    $('#settings-modal').modal('hide');
    refreshView();
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
    var settings = Cookies.getJSON('settings');

    $.getJSON("settings.json", function(defaults) {
        if (typeof(settings) === 'undefined') {
            settings = defaults;
            notify('Default settings loaded.', 'info');
        } else if (!compareJSON(settings, defaults)) {
            settings = defaults;
            notify('Custom settings no longer valid, reverting to defaults.',
                      'info');
        }
        Cookies.set('settings', settings);

    }).done(function() {
        var template = $("#xslt-options-template").html(),
            rendered = Mustache.render(template, {options: settings.xslt});
        $('#select-xslt').html(rendered);
        $('#show-borders').val(settings.showBorders.toCapsString());
        $('#show-tooltips').val(settings.showTooltips.toCapsString());
        $('#freeze-header').val(settings.freezeHeader.toCapsString());
        $('#n-records').val(settings.recordsPerPage);
        $('.selectpicker').selectpicker('refresh');
        createTeiTable($('#tei-view')).then(function(table){
            teiTable = table;
            refreshView();
        });
    }).fail(function(xhr, textStatus, errorThrown) {
        notify("Settings file not found", 'error');
        throw err;
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


/** Handle add files event. */
$(".add-files").change(function(evt) {
    var files = evt.target.files;
    uploadFiles(files);
});


/** Handle a show XML event. */
$("#tei-view").on('click', ".show-xml", function(evt) {
    var recordID = parseInt($(this).parents('tr')[0].id);
    evt.preventDefault();
    server.tei.get(recordID).then(function(result) {
        if (typeof(codeEditor) !== 'undefined') {
            codeEditor.getWrapperElement().remove();
        }
        $('#record-id').html(result.id);
        $('#xml-textarea').text(result.xml);
        showView('xml');
        codeEditor = CodeMirror.fromTextArea(document.getElementById('xml-textarea'), {
            mode:'text/xml',
            lineNumbers: true,
            autofocus: true,
            lineWrapping: true,
        });
    });
});


/** Handle upload box drag and drop event. */
$('#upload-view').on('drag dragstart dragend dragover dragenter dragleave drop', function(evt) {
    var files = {};
    evt.preventDefault();
    evt.stopPropagation();
}).on('dragover dragenter', function() {
    $('#upload-view').addClass('is-dragover');
}).on('dragleave dragend drop', function() {
    $('#upload-view').removeClass('is-dragover');
}).on('drop', function(e) {
    files = evt.originalEvent.dataTransfer.files;
    uploadFiles(files);
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
    showView('loading');
    $.ajaxSetup({ cache: false });
    $('[data-toggle="tooltip"]').tooltip();

    // Configure DB and load settings
    db.open(dbOptions).then(function(s) {
        server = s;
        loadSettings();
    }).catch(function (err) {
        notify(err.message, 'error');
        throw err;
    });
});

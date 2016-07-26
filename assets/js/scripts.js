var teiTable = {};
var server = {};
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
}


/**
 * Upload XML files.
 * @param {FileList} files - The files to upload.
 */
function uploadFiles(files) {
    showView('loading');
    var pending = files.length,
        reader  = {};

    for (var i = 0, f; f = files[i]; i++) {
        if (f.type !== 'text/xml') {
            showAlert(f.name + ' is not a valid XML file', 'warning');
            continue;
        }
        reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(evt) {

                server.tei.add({
                    xml: evt.target.result
                }).catch(function (err) {
                    showAlert(err, 'danger');
                    throw err
                });

                --pending
                if (pending == 0) {
                    $('.upload-form').trigger("reset");
                    refreshView();
                }
            };
        })(f);
        reader.readAsText(f);
    }
}


/**
 * Show a view.
 * @param {string} view - The view to show.
 */
function showView(view) {
    $('.view').hide();
    $('#' + view + '-view').show();
}


/**
 * Remove the XML declaration and add the database ID to an XML document.
 * @param {string} view - The XML string to format.
 * @param {string} id - The database ID of the record.
 */
function preformatXml(xml, id) {
    var xmlStr = xml.replace(/<\?xml.*?\?>/g, ""),
        xmlStr = xml.replace(/<TEI>/g, "<TEI id=" + id + ">");
    return xmlStr;
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
    return loadXMLDoc(xmlStr);
}


/** Refresh the view. */
function refreshView() {
    var perPage = Cookies.getJSON('settings').recordsPerPage;
        xmlDoc   = {};
    if (typeof(teiTable) !== 'undefined' && !teiTable.XSLTProcLoaded()) {
        showAlert('XSLT processor not loaded, please try again.', 'warning');
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
                    showAlert(err, 'danger');
                    throw err
                });

            }).catch(function (err) {
                showView('upload');
                showAlert(err, 'danger');
                throw err
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
 * Display a Bootstrap alert.
 * @param {string} msg - The message.
 * @param {string} type - The type of the message.
 */
function showAlert(msg, type) {
    var template = $("#alert-template").html();
        rendered = Mustache.render(template, {msg: msg, type: type});
    $("#alerts").html(rendered);
}


/** Setup an XSLT processor. */
function setupXSLTProcessor() {
    var tableXSLT = $('#select-xslt').val();
    return Promise.resolve($.ajax({
        url: "assets/xslt/" + tableXSLT
    })).then(function(data) {
        XSLTProc = new XSLTProcessor();
        XSLTProc.importStylesheet(data);
        teiTable = new TeiTable();
        teiTable.updateXSLTProc(XSLTProc)
    }).catch(function() {
        showAlert('XSLT file ' + tableXSLT + ' could not be loaded, try \
                  reverting to default settings.', 'danger');
    }).then(function() {
        refreshView();
    });
}


/**
 * Load and return an XML document.
 * @param {string} xmlStr - The XML string.
 */
function loadXMLDoc(xmlStr) {
    var xmlDoc = {};
    if (typeof window.DOMParser != "undefined") {
        return function(xmlStr) {
            return (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
        }(xmlStr);
    } else if (typeof window.ActiveXObject != "undefined" &&
        new window.ActiveXObject("Microsoft.XMLDOM")) {
            return function(xmlStr) {
                xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(xmlStr);
                return xmlDoc;
            }(xmlStr);
    } else {
        showAlert("No XML parser found", 'danger');
        throw new Error("No XML parser found");
    }
}


/** Clear selected rows. */
$( "#clear-selected" ).click(function(evt) {
    evt.preventDefault();
    showView("loading");
    $('#tei-view table tr[selected]').remove();
    currentPage = 0;
    refreshView();
});


/** Clear all rows. */
$( "#clear-all" ).click(function(evt) {
    evt.preventDefault();
    showView("loading");
    currentPage = 0;
    server.tei.clear();
    refreshView();
});


/** Export the table to CSV. */
$( "#csv-export" ).click(function() {

    // Return an escaped CSV string
    function formatCSV(str) {
        return '"' + str.replace(/"/g, '""') + '"';
    }

    // Get table rows
    var rows = [];
    $('table tr').each(function() {
        var row = [];
        $(this).find('th,td').each(function () {
            var val = $(this)[0].innerText;
            row.push(formatCSV(val));
        });
        rows.push(row.join(','));
    });

    var csvString = rows.join("\n");
    var encodedUri = encodeURI('data:attachment/csv;charset=utf-8,\uFEFF' + csvString);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tei_data.csv");
    link.click();
});


/** Reset to default settings. */
$( "#reset-settings" ).click(function() {
    evt.preventDefault();
    showView("loading");
    var settings = Cookies.getJSON('settings');
    $('#settings-modal').modal('hide');
    loadSettings();
    showAlert('All settings have been reset to their defaults.', 'info');
});


/** Handle change of XSLT setting. */
$( "#select-xslt" ).change(function() {
    var settings    = Cookies.getJSON('settings'),
        defaultXSLT = $('#select-xslt').val();
    $.each(settings.xslt, function(index, value) {
        if (value.filename == defaultXSLT) {
            value['default'] = true;
        } else {
            value['default'] = false;
        }
    });
    Cookies.set('settings', settings);
    $('#settings-modal').modal('hide');
    setupXSLTProcessor();
});


/** Handle change of show tooltips setting. */
$( "#show-tooltips" ).change('click', function() {
    var settings = Cookies.getJSON('settings'),
        showTips = $('#show-tooltips').val() == 'True';
    settings.showTooltips = showTips;
    Cookies.set('settings', settings);
    $('#settings-modal').modal('hide');
    applySettings();
});


/** Handle change of show borders setting. */
$( "#show-borders" ).change('click', function() {
    var settings    = Cookies.getJSON('settings'),
        showBorders = $('#show-borders').val() == 'True';
    settings.showBorders = showBorders;
    Cookies.set('settings', settings);
    $('#settings-modal').modal('hide');
    applySettings();
});


/** Handle change of freeze header setting. */
$( "#freeze-header" ).change('click', function() {
    var settings     = Cookies.getJSON('settings'),
        freezeHeader = $('#freeze-header').val() == 'True';
    settings.freezeHeader = freezeHeader;
    Cookies.set('settings', settings);
    $('#settings-modal').modal('hide');
    applySettings();
});


/** Handle change of records per page setting. */
$( "#n-records" ).change('click', function(evt) {
    evt.preventDefault();
    showView("loading");
    var settings       = Cookies.getJSON('settings'),
        recordsPerPage = parseInt($('#n-records').val());
    settings.recordsPerPage = recordsPerPage;
    Cookies.set('settings', settings);
    $('#settings-modal').modal('hide');
    refreshView();
});


/** Load README.md into the help modal. */
$("#help-modal").on("show.bs.modal", function() {
    var converter = new showdown.Converter(),
        str       = "",
        html      = "";
    $.get("README.md", function(readme) {
        str  = readme.replace(/[\s\S]+?(?=#)/, "");
        html = converter.makeHtml(text);
        $(this).find(".modal-body").html(html);
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
    var settings = Cookies.getJSON('settings');

    $.getJSON("settings.json", function(defaults) {
        if (typeof(settings) === 'undefined') {
            settings = defaults;
            showAlert('Default settings loaded.', 'info');
        } else if (!compareJSON(settings, defaults)) {
            settings = defaults;
            showAlert('Custom settings no longer valid, reverting to \
                      defaults.', 'info');
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
        setupXSLTProcessor();
    }).fail(function(err) {
        showAlert(err, 'danger');
        throw err
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
                currentPage = num - 1;
                refreshView();
            });
    } else {
        $('#page-selection').html('');
    }
}


/** Check for the required HTML5 features */
function checkHTML5Features() {
    var unsupported = [],
        msg         = "",
        div         = document.createElement('div');

    if (typeof(FileReader) == 'undefined' || typeof(FileList) == 'undefined'
        || typeof(Blob) == 'undefined') {
        unsupported.push('File APIs');
    }
    if (typeof(Promise) == 'undefined') {
        unsupported.push('Promises');
    }
    if (typeof(indexedDB) == 'undefined') {
        unsupported.push('indexedDB');
    }
    if (!('draggable' in div) || !('ondragstart' in div && 'ondrop' in div)) {
        unsupported.push('Drag and Drop');
    }

    if (unsupported.length > 0) {
        msg = unsupported.pop();
        if (unsupported.length > 0) {
            msg = unsupported.join(', ') + ' or ' + unsupported;
        }
        showAlert('Your browser does not support HTML5 ' + msg + '. \
                   Try upgrading (Firefox 45, Chrome 45 or Safari 9 \
                   recommended).', 'danger');
        throw new Error("HTML5 " + msg + " not supported.");
    }
}


/** Handle click event for hide column menu item. */
$( "#hide-menu" ).on('click', '.hide-column', function(evt) {
    var index = parseInt($(this).attr('data-index'));
    evt.preventDefault();
    teiTable.hideColumn(index);
    applySettings();
});


/** Handle click event for show column menu item. */
$( "#show-menu" ).on('click', '.show-column', function(evt) {
    var index = parseInt($(this).attr('data-index'));
    evt.preventDefault();
    teiTable.showColumn(index);
    applySettings();
});


/** Handle add files event. */
$( ".add-files" ).change(function(evt) {
    var files = evt.target.files;
    uploadFiles(files);
});


/** Handle upload box drag and drop event. */
$('#upload-view').on('drag dragstart dragend \
                     dragover dragenter dragleave drop', function(evt) {
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
    if (evt.target.nodeName != "A" &&
        typeof($(this).attr('selected')) === 'undefined') {
            $(this).find('td').css('background-color', '#eee');
            $(this).attr('selected', 'true');
    } else {
        $(this).find('td').css('background-color', '#fff');
        $(this).removeAttr('selected');
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
}


// Initialise
$(function() {
    showView('loading');
    $.ajaxSetup({ cache: false });
    $('[data-toggle="tooltip"]').tooltip();

    checkHTML5Features();

    // Configure DB and load settings
    db.open(dbOptions).then(function(s) {
        server = s;
        loadSettings();
    }).catch(function (err) {
        showAlert(err, 'danger');
        throw err
    });
});

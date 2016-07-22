var teiTable, server;
var dbOptions = {
    server: 'tei-viewer',
    version: 3,
    schema: {
        tei: {
            key: {keyPath: 'id', autoIncrement: true}
        }
    }
}

/** Upload XML files. */
function uploadFiles(files) {
    showView('loading');
    var pending = files.length;

    for (var i = 0, f; f = files[i]; i++) {
        if (f.type !== 'text/xml') {
            showAlert(f.name + ' is not a valid XML file', 'warning');
            continue;
        }

        var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {

                //Remove XML declaration (for merging) and store
                var xmlStr = e.target.result.replace(/<\?xml.*?\?>/g, "");
                server.tei.add({
                    xml: xmlStr
                }).then(function (item) {
                    // item stored
                }).catch(function (err) {
                    showAlert(err, 'danger');
                    throw err
                });

                --pending
                if (pending == 0) {
                    refreshView();
                }
            };
        })(f);
        reader.readAsText(f);
    }
}


/** Show a view. */
function showView(view) {
    var views   = ['upload', 'loading', 'tei'],
        visible = views.pop(view);
    $('#' + view + '-view').show();
    $.each(views, function(i, v){
        $('#' + v + '-view').hide();
    });
}


/** Hide column menu item clicked. */
$( "#hide-menu" ).on('click', '.hide-column', function(e) {
    var index = parseInt($(this).attr('data-index'));
    teiTable.hideColumn(index);
    refreshView();
    e.preventDefault();
});


/** Show column menu item clicked. */
$( "#show-menu" ).on('click', '.show-column', function(e) {
    var index = parseInt($(this).attr('data-index'));
    teiTable.showColumn(index);
    refreshView();
    e.preventDefault();
});


/** Refresh the main view. */
function refreshView() {
    if (typeof(teiTable) !== 'undefined' && !teiTable.XSLTProcLoaded()) {
        showAlert('XSLT processor not loaded, please try again.', 'warning');
    } else {
        loadRecords(1);
    }
    $('.upload-form').trigger("reset");
}


/** Apply settings. */
function applySettings() {
    var settings = Cookies.getJSON('settings');
    if (settings.showBorders) {
        teiTable.showBorders();
    } else {
        teiTable.hideBorders();
    }
    if (settings.showTooltips) {
        teiTable.showTooltips();
    } else {
        teiTable.hideTooltips();
    }
    if (settings.freezeHeader) {
        teiTable.freezeHeader();
    } else {
        teiTable.unfreezeHeader();
    }
}


/** Display a Bootstrap alert. */
function showAlert(msg, type) {
    var template = $("#alert-template").html();
        rendered = Mustache.render(template, {msg: msg, type: type});
    $( "#alerts" ).html(rendered);
}


/** Clear selected rows. */
$( "#clear-rows" ).click(function() {
    $('#tei-view table tr[selected]').remove();
});


/** Refresh the current XSLT processors. */
function refreshXSLTProcessor() {
    showView('loading');
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
        showView('tei');
        refreshView();
    });
}


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


/** Load and return an XML document. */
function loadXMLDoc(text) {
    var parseXml;
    if (typeof window.DOMParser != "undefined") {
        parseXml = function(xmlStr) {
            return (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
        };
    } else if (typeof window.ActiveXObject != "undefined" &&
        new window.ActiveXObject("Microsoft.XMLDOM")) {
        parseXml = function(xmlStr) {
            var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        };
    } else {
        var msg = "No XML parser found";
        showAlert(msg, 'danger')
        throw new Error(msg);
    }
    return parseXml(text);
}


/** Reset to default settings. */
$( "#reset-settings" ).click(function() {
    loadDefaultSettings();
    $('#settings-modal').modal('hide');
    showAlert('All settings have been reset to their defaults.', 'info');
    refreshView();
});


/** Handle change of XSLT setting. */
$( "#select-xslt" ).change(function() {
    showView('loading');
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
    refreshXSLTProcessor();
});


/** Handle change of show tooltips setting. */
$( "#show-tooltips" ).change('click', function() {
    var settings = Cookies.getJSON('settings'),
        showTips = $('#show-tooltips').val() == 'True';
    settings.showTooltips = showTips;
    Cookies.set('settings', settings);
    refreshView();
    $('#settings-modal').modal('hide');
});


/** Handle change of show borders setting. */
$( "#show-borders" ).change('click', function() {
    var settings    = Cookies.getJSON('settings'),
        showBorders = $('#show-borders').val() == 'True';
    settings.showBorders = showBorders;
    Cookies.set('settings', settings);
    refreshView();
    $('#settings-modal').modal('hide');
});


/** Handle change of records per page setting. */
$( "#n-records" ).change('click', function() {
    var settings       = Cookies.getJSON('settings'),
        recordsPerPage = parseInt($('#n-records').val());
    settings.recordsPerPage = recordsPerPage;
    Cookies.set('settings', settings);
    refreshView();
    $('#settings-modal').modal('hide');
});


/** Handle change of freeze header setting. */
$( "#freeze-header" ).change('click', function() {
    var settings     = Cookies.getJSON('settings'),
        freezeHeader = $('#freeze-header').val() == 'True';
    settings.freezeHeader = freezeHeader;
    Cookies.set('settings', settings);
    $('#settings-modal').modal('hide');
    refreshView();
});


/** Load and validate settings from cookie. */
function loadSettings(){
    showView('loading');
    var settings = Cookies.getJSON('settings');

    $.getJSON("settings.json", function(defaultSettings) {
        var aKeys = Object.keys(defaultSettings).sort();
        var bKeys = Object.keys(settings).sort();
        if(JSON.stringify(aKeys) !== JSON.stringify(bKeys)) {
            Cookies.set('settings', defaultSettings);
            settings = defaultSettings;
            showAlert('Custom settings no longer valid, reverting to \
                      defaults.', 'info');
        }
    }).done(function() {
        var template = $("#xslt-options-template").html(),
            rendered = Mustache.render(template, {options: settings.xslt});
        $('#select-xslt').html(rendered);

        $('#show-borders').val(settings.showBorders.toCapsString());
        $('#show-tooltips').val(settings.showTooltips.toCapsString());
        $('#freeze-header').val(settings.freezeHeader.toCapsString());
        $('#n-records').val(settings.recordsPerPage);
        $('.selectpicker').selectpicker('refresh');
        refreshXSLTProcessor();
    }).fail(function(e) {
        showAlert('settings.json could not be loaded.', 'danger');
        throw e
    });
}


/** Load default settings. */
function loadDefaultSettings() {
    showView('loading');
    $.getJSON("settings.json", function( settings ) {
        Cookies.set('settings', settings);
    }).done(function() {
        loadSettings();
    }).fail(function(e) {
        showAlert('settings.json could not be loaded.', 'danger');
        throw e
    }).always(function() {
        showView('tei');
    });
}


/** Load README.md into the help modal. */
$("#help-modal").on("show.bs.modal", function() {
    var modalBody = $(this).find(".modal-body");
    $.get("README.md", function( readme ) {
        var converter = new showdown.Converter();
        var text = readme.replace(/[\s\S]+?(?=#)/, "");
        var html = converter.makeHtml(text);
        modalBody.html(html);
    });
});


/** Update the status bar with the number of records in the DB. */
function countRecords() {
    server.tei.count().then(function (n) {
        $('#files-uploaded').html(n + ' files uploaded');
        if (n > 0) {
            showView('tei');
        } else {
            showView('upload');
        }
        teiTable.fixFrozenTable();
    }).catch(function (err) {
        showAlert(err, 'danger');
        throw err
    });
}


/** Load records from the DB and transform. */
function loadRecords(page, nDisplayed){
    showView('loading');
    var nRecords = Cookies.getJSON('settings').recordsPerPage;
    server.tei
        .query()
        .all()
        .limit(page, nRecords)
        .execute()
        .then(function (data) {
            var records = [];
            $.each(data, function(i, v){
                records.push(v.xml);
            });
            var xmlStr = '<MERGED-TEI>' + records.join("") + '</MERGED-TEI>',
            xmlDoc = loadXMLDoc(xmlStr);
            teiTable.populate(xmlDoc);
            countRecords();
            applySettings();
            showView('tei');
        }).catch(function (err) {
            showAlert(err, 'danger');
            throw err
        });
}


/** Check for the required HTML5 features */
function checkHTML5() {
    var unsupportedFeatures = []
    if (typeof(FileReader) == 'undefined' || typeof(FileList) == 'undefined'
        || typeof(Blob) == 'undefined') {
        unsupportedFeatures.push('File APIs');
    }
    if (typeof(Promise) == 'undefined') {
        unsupportedFeatures.push('Promises');
    }
    if (typeof(indexedDB) == 'undefined') {
        unsupportedFeatures.push('indexedDB');
    }
    var div = document.createElement('div');
    if (!('draggable' in div) || !('ondragstart' in div && 'ondrop' in div)) {
        unsupportedFeatures.push('Drag and Drop');
    }
    if (unsupportedFeatures.length > 0) {
        var uStr = unsupportedFeatures.pop();
        if (unsupportedFeatures.length > 0) {
            uStr = unsupportedFeatures.join(', ') + ' or ' + uStr;
        }
        showAlert('Your browser does not support HTML5 ' + uStr + '. \
                   Try upgrading (Firefox 45, Chrome 45 or Safari 9 \
                   recommended).', 'danger');
        throw new Error("HTML5 " + uStr + " not supported.");
    }
}


/** Handle add files event. */
$( ".add-files" ).change(function(evt) {
    var files = evt.target.files;
    uploadFiles(files);
});


/** Handle upload box drag and drop event. */
$('#upload-view').on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
}).on('dragover dragenter', function() {
    $('#upload-view').addClass('is-dragover');
}).on('dragleave dragend drop', function() {
    $('#upload-view').removeClass('is-dragover');
}).on('drop', function(e) {
    var files = e.originalEvent.dataTransfer.files;
    uploadFiles(files);
});


/** Handle row clicked event. */
$("#tei-view").on('click', 'tr:not(a)', function(e) {
    if (e.target.nodeName != "A" && typeof($(this).attr('selected')) === 'undefined') {
        $(this).find('td').css('background-color', '#eee');
        $(this).attr('selected', 'true');
    } else {
        $(this).find('td').css('background-color', '#fff');
        $(this).removeAttr('selected');
    }
});


/** Handle table scroll event. */
$("#tei-view").scroll(function() {
    if (typeof(teiTable) !== 'undefined') {
        teiTable.fixFrozenTable();
    }
});


/** Handle window resize event. */
$(window).resize(function() {
    if (typeof(teiTable) !== 'undefined') {
        teiTable.fixFrozenTable();
    }
});


//Function to convert boolean to capitalized string
Boolean.prototype.toCapsString = function () {
    return this.toString().charAt(0).toUpperCase() + this.toString().slice(1);
}


$(function() {
    $.ajaxSetup({ cache: false });
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    checkHTML5();

    db.open(dbOptions).then(function (s) {
        server = s;
        if (typeof Cookies.get('settings') != "undefined") {
            loadSettings();
        } else {
            loadDefaultSettings();
        }
    }).catch(function (err) {
        showAlert(err, 'danger');
        throw err
    });
});
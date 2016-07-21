var teiTable, db;

/** Upload XML files. */
function uploadFiles(files) {
    showLoading();
    var pending = files.length;

    for (var i = 0, f; f = files[i]; i++) {
        if (f.type !== 'text/xml') {
            showAlert(f.name + ' is not a valid XML file', 'warning');
            continue;
        }

        var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {

                var key = theFile.name += Date.now();

                //Remove XML declaration (for merging) and store
                var xmlStr      = e.target.result.replace(/<\?xml.*?\?>/g, ""),
                    transaction = db.transaction("TeiStore", "readwrite"),
                    store       = transaction.objectStore("TeiStore"),
                    request     = store.put({id: key, xml: xmlStr});

                request.onerror = function(e) {
                    showAlert(e.target.error, 'danger');
                }

                --pending
                if (pending == 0) {
                    refreshView();
                }
            };
        })(f);
        reader.readAsText(f);
    }
}


/** Show loading icon. */
function showLoading() {
    $('#files-uploaded').hide();
    $('#loading-icon').show();
}


/** Hide loading icon. */
function hideLoading() {
    $('#loading-icon').hide();
    $('#files-uploaded').show();
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
        loadRecords();
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
    $('#tei-table tr[selected]').remove();
});


/** Refresh the current XSLT processors. */
function refreshXSLTProcessor() {
    showLoading();
    var tableXSLT = $('#select-xslt').val();
    var tablePromise = Promise.resolve($.ajax({
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
        hideLoading();
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


//Function to convert boolean to capitalized string
Boolean.prototype.toCapsString = function () {
    return this.toString().charAt(0).toUpperCase() + this.toString().slice(1);
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
    showLoading();
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
    if (showTips) {
        teiTable.showTooltips();
    } else {
        teiTable.hideTooltips();
    }
    $('#settings-modal').modal('hide');
});


/** Handle change of show borders setting. */
$( "#show-borders" ).change('click', function() {
    var settings    = Cookies.getJSON('settings'),
        showBorders = $('#show-borders').val() == 'True';
    settings.showBorders = showBorders;
    Cookies.set('settings', settings);
    if (showBorders) {
        teiTable.showBorders();
    } else {
        teiTable.hideBorders();
    }
    $('#settings-modal').modal('hide');
});


/** Handle change of freeze header setting. */
$( "#freeze-header" ).change('click', function() {
    var settings     = Cookies.getJSON('settings'),
        freezeHeader = $('#freeze-header').val() == 'True';
    settings.freezeHeader = freezeHeader;
    console.log(freezeHeader);
    Cookies.set('settings', settings);
    $('#settings-modal').modal('hide');
    refreshView();
});


/** Load and validate settings from cookie. */
function loadSettings(){
    showLoading();
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
        // XSLT
        var template = $("#xslt-options-template").html(),
            rendered = Mustache.render(template, {options: settings.xslt});
        $('#select-xslt').html(rendered);

        $('.selectpicker').selectpicker('refresh');
        refreshXSLTProcessor();
    }).fail(function(e) {
        showAlert('settings.json could not be loaded.', 'danger');
        throw e
    }).always(function() {
        hideLoading();
    });
}


/** Load default settings. */
function loadDefaultSettings() {
    showLoading();
    $.getJSON("settings.json", function( settings ) {
        Cookies.set('settings', settings);
    }).done(function() {
        loadSettings();
    }).fail(function(e) {
        showAlert('settings.json could not be loaded.', 'danger');
        throw e
    }).always(function() {
        hideLoading();
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


/** Setup the database. */
function setupDB() {
    var indexedDB = window.indexedDB || window.mozIndexedDB ||
                    window.webkitIndexedDB || window.msIndexedDB ||
                    window.shimIndexedDB;
    var dbVersion = 2;
    var open = indexedDB.open("TeiViewerDB", dbVersion);

    open.onupgradeneeded = function(e) {
        var thisDB = e.target.result,
            store  = thisDB.createObjectStore("TeiStore", {keyPath: "id"});
    }

    open.onsuccess = function(e) {
        db = e.target.result;
    }

    open.onerror = function(e) {
        $('.upload-form').hide();
        showAlert('Database could not be initialised.', 'danger');
    }
}


/** Update the status bar with the number of records in the DB. */
function countRecords() {
    var transaction = db.transaction("TeiStore", "readonly"),
        store       = transaction.objectStore("TeiStore"),
        count       = store.count();
    count.onsuccess = function() {
        $('#files-uploaded').html(count.result + ' files uploaded');
        if (count.result > 0) {
            $('.upload-box').hide();
            $('#tei-table').show();
        } else {
            $('.upload-box').show();
            $('#tei-table').hide();
        }
    }
    count.onerror = function(e) {
        showAlert(e.target.error, 'danger');
    }
}

/** Load records from the DB and transform. */
function loadRecords(){
    showLoading();
    var transaction = db.transaction("TeiStore", "readonly"),
        store       = transaction.objectStore("TeiStore"),
        cursor      = store.openCursor();
        records     = [];

    cursor.onsuccess = function(e) {
        var res = e.target.result;
        if(res) {
            records.push(res.value.xml);
            res.continue();
        }
    }
    cursor.onerror = function(e) {
        showAlert(e.target.error, 'danger');
    }

    transaction.oncomplete = function(e) {
        var xmlStr = '<MERGED-TEI>' + records.join("") + '</MERGED-TEI>',
            xmlDoc = loadXMLDoc(xmlStr);
        teiTable.populate(xmlDoc);
        countRecords();
        applySettings();
        hideLoading();
    }
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
$('.upload-box').on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
}).on('dragover dragenter', function() {
    $('.upload-box').addClass('is-dragover');
}).on('dragleave dragend drop', function() {
    $('.upload-box').removeClass('is-dragover');
}).on('drop', function(e) {
    var files = e.originalEvent.dataTransfer.files;
    uploadFiles(files);
});


/** Handle row clicked event. */
$("#tei-table").on('click', 'tr:not(a)', function(e) {
    if (e.target.nodeName != "A" && typeof($(this).attr('selected')) === 'undefined') {
        $(this).find('td').css('background-color', '#eee');
        $(this).attr('selected', 'true');
    } else {
        $(this).find('td').css('background-color', '#fff');
        $(this).removeAttr('selected');
    }
});


/** Handle table scroll event. */
$("#tei-table").scroll(function() {
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


$(function() {
    $.ajaxSetup({ cache: false });
    checkHTML5();
    setupDB();

    // Initialise settings
    if (typeof Cookies.get('settings') != "undefined") {
        loadSettings();
    } else {
        loadDefaultSettings();
    }

    // Initialise tooltips
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
});
var teiTable;

/** Add XML files to local storage. */
function uploadFiles(files) {
    showLoading();
    var uniqueFilenames = $('#unique-fn').val() == 'True';
    var pending = files.length;

    for (var i = 0, f; f = files[i]; i++) {
        if (f.type !== 'text/xml') {
            showAlert(f.name + ' is not a valid XML file', 'warning');
            continue;
        }

        var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {

                // Check for uniqueness
                var key = theFile.name;
                if (localStorage.getItem(theFile.name) && uniqueFilenames) {
                    showAlert('A file with the name ' + theFile.name + ' has \
                              already been uploaded.', 'warning');
                } else if (!uniqueFilenames) {
                    key += Date.now();
                }

                try {
                    //Remove XML declaration (for merging) and store
                    var xmlStr = e.target.result.replace(/<\?xml.*?\?>/g, "");
                    localStorage.setItem(key, xmlStr);
                } catch (e) {
                    hideLoading();
                    showAlert("Upload failed, local storage quota \
                              exceeded. The currently loaded files must be \
                              cleared before more can be uploaded.", 'danger');
                    throw new Error(e)
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
    showLoading();
    if (!teiTable.XSLTProcLoaded()) {
        showAlert('XSLT processor not loaded, please try again.', 'warning');
    } else if(localStorage.length > 0) {
        var mergedXML = mergeUploadedDocs();
        teiTable.populate(mergedXML);
        $('.upload-box').hide();
        $('#table-scroll').show();
    } else {
        $('.upload-box').show();
        $('#table-scroll').hide();
    }
    $('#files-uploaded').html(localStorage.length + ' files uploaded');
    $('.upload-form').trigger("reset");
    enableSettings();
    hideLoading();
}


/** Enable or disable settings certain settings if local storage is empty. */
function enableSettings() {
    if (localStorage.length == 0){
        $('#unique-fn').attr('disabled', false);
        $('#reset-settings').attr('disabled', false);
        $('#disabled-settings-msg').hide();
    } else {
        $('#unique-fn').attr('disabled', true);
        $('#reset-settings').attr('disabled', true);
        $('#disabled-settings-msg').show();
    }
    $('#unique-fn').selectpicker('refresh');
}


/** Return all uploaded files merged into single XML document. */
function mergeUploadedDocs(){
    var xmlStr, values = [], keys = Object.keys(localStorage), i = keys.length;
    while ( i-- ) {
        values.push(localStorage.getItem(keys[i]));
    }
    xmlStr = '<MERGED-TEI>' + values.join("") + '</MERGED-TEI>';
    return loadXMLDoc(xmlStr);
}


/** Display a Bootstrap alert. */
function showAlert(msg, type) {
    var template = $("#alert-template").html();
        rendered = Mustache.render(template, {msg: msg, type: type});
    $( "#alerts" ).html(rendered);
}


/** Clear local storage and refresh views. */
$( "#clear-views" ).click(function() {
    showLoading();
    localStorage.clear();
    refreshView();
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
        showAlert('XSLT file ' + tableXSLT + ' could not be loaded.',
                  'danger');
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
        hideLoading();
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
    $('settings-modal').modal('hide');
    showAlert('All settings have been reset to their defaults.', 'info');
    refreshView();
});


/** Handle change of XSLT setting. */
$( "#select-xslt" ).change(function() {
    showLoading();
    var settings = Cookies.getJSON('settings');
    var defaultXSLT = $('#select-xslt').val();
    $.each(settings.xslt, function(index, value) {
        if (value.label == defaultXSLT) {
            value.default = true;
        } else {
            value.default = false;
        }
    });
    Cookies.set('settings', settings);
    refreshXSLTProcessor();
});


/** Handle change of unique filenames setting. */
$( "#unique-fn" ).change(function() {
    var settings = Cookies.getJSON('settings');
    var uniqueFn = $('#unique-fn').val() == 'True';
    settings.uniqueFilenames = uniqueFn;
    Cookies.set('settings', settings);
});


/** Handle change of fixed table setting. */
$( "#fixed-table" ).change(function() {
    var settings = Cookies.getJSON('settings');
    var fixedTable = $('#fixed-table').val() == 'True';
    settings.fixedTable = fixedTable;
    Cookies.set('settings', settings);
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

        // Unique filenames
        var uniqueFn = settings.uniqueFilenames.toCapsString()
        $('#unique-fn').val(uniqueFn);

        // Fixed table
        var fixedTable = settings.fixedTable.toCapsString()
        $('#fixed-table').val(fixedTable);

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
        loadSettings();
    }).done(function() {
        refreshXSLTProcessor();
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


/** Check for the required HTML5 features */
function checkHTML5() {
    var unsupportedFeatures = []
    if (typeof(localStorage) == 'undefined' ) {
        unsupportedFeatures.push('localStorage.');
    }
    if (typeof(FileReader) == 'undefined' || typeof(FileList) == 'undefined'
        || typeof(Blob) == 'undefined') {
        unsupportedFeatures.push('File APIs');
    }
    if (typeof(Promise) == 'undefined') {
        unsupportedFeatures.push('Promises');
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


$(function() {
    $.ajaxSetup({ cache: false });
    checkHTML5();

    // Initialise settings
    if (typeof Cookies.get('settings') != "undefined") {
        loadSettings();
    } else {
        loadDefaultSettings();
    }
});
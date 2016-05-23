var tableXSLTProcessor, listXSLTProcessor;

/** Add XML files to local storage. */
$( "#add-files" ).change(function(evt) {
    showLoading();
    var files = evt.target.files;
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
                    refreshViews();
                }
            };
        })(f);
        reader.readAsText(f);
    }
});


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


/** Refresh the table and list views. */
function refreshViews() {
    var mergedDocs = mergeUploadedDocs();
    if (typeof tableXSLTProcessor == "undefined" ||
        typeof listXSLTProcessor == "undefined") {
        showAlert('XSLT processors not loaded yet, please try again.', 'warning');
    } else {
        var tableDoc = tableXSLTProcessor.transformToFragment(mergedDocs, document);
        var listDoc = listXSLTProcessor.transformToFragment(mergedDocs, document);
        var hiddenCols = getHiddenColumns();
        $('#table-data').html(tableDoc);
        $('#list-data').html(listDoc);
        $(hiddenCols).each(function(k, v) {  // Hide previously hidden columns
            hideColumn(v);
        });
    }
    $('#files-uploaded').html(localStorage.length + ' files uploaded');
    $('#tei-form').trigger("reset");
    enableSettings();
    populateTableMenus();
    fixedTables = $('#fixed-table').val() == 'True';
    setTableAsFixed(fixedTables);
    hideLoading();
}


/** Enable or disable settings certain settings if local storage is empty. */
function enableSettings() {
    if (localStorage.length == 0){
        $('#unique-fn').attr('disabled', false);
        $('#default-settings').attr('disabled', false);
        $('#disabled-settings-msg').hide();
    } else {
        $('#unique-fn').attr('disabled', true);
        $('#default-settings').attr('disabled', true);
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
        $( "#alerts" ).append(rendered);
}


/** Clear local storage and refresh views. */
$( "#clear-views" ).click(function() {
    showLoading();
    localStorage.clear();
    refreshViews();
});


/** Refresh the current XSLT processors. */
function refreshXSLTProcessors() {
    var tableXSLT = $('#select-table-xslt').val();
    var listXSLT = $('#select-list-xslt').val();

    // Load the table XSLT
    var tablePromise = Promise.resolve($.ajax({
        url: "assets/xsl/" + tableXSLT
    })).then(function(result) {
        tableXSLTProcessor = new XSLTProcessor();
        tableXSLTProcessor.importStylesheet(result);

        //Then load the list XSLT
        var listPromise = Promise.resolve($.ajax({
            url: "assets/xsl/" + listXSLT
        })).then(function(result) {
            listXSLTProcessor = new XSLTProcessor();
            listXSLTProcessor.importStylesheet(result);
            refreshViews();
        }, function() {
            showAlert('The XSLT file ' + listXSLT + ' could not be loaded.',
                      'danger');
        });
    }, function() {
        showAlert('The XSLT file ' + tableXSLT + ' could not be loaded.',
                      'danger');
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
$( "#default-settings" ).click(function() {
    loadDefaultSettings();
});


/** Handle change of load table XSLT setting. */
$( "#select-table-xslt" ).change(function() {
    showLoading();
    var settings = Cookies.getJSON('settings');
    settings.xsl.selectedTable = $('#select-table-xslt').val();
    Cookies.set('settings', settings);
    refreshXSLTProcessors();
});


/** Handle change of load list XSLT setting. */
$( "#select-list-xslt" ).change(function() {
    showLoading();
    var settings = Cookies.getJSON('settings');
    settings.xsl.selectedList = $('#select-list-xslt').val();
    Cookies.set('settings', settings);
    refreshXSLTProcessors();
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
    refreshViews();
});


/** Load settings from cookie. */
function loadSettings(){
    var settings = Cookies.getJSON('settings');

    // XSLT files
    var template  = $("#xslt-options-template").html(),
        tRendered = Mustache.render(template, {options: settings.xsl.table}),
        lRendered = Mustache.render(template, {options: settings.xsl.list});
    $('#select-table-xslt').html(tRendered);
    $('#select-list-xslt').html(lRendered);

    // Unique filenames
    var uniqueFn = settings.uniqueFilenames.toCapsString()
    $('#unique-fn').val(uniqueFn);

    // Fixed table
    var fixedTable = settings.fixedTable.toCapsString()
    $('#fixed-table').val(fixedTable);

    $('.selectpicker').selectpicker('refresh');
    refreshXSLTProcessors();
}


/** Reset to default settings. */
function loadDefaultSettings() {
    $.getJSON( "settings.json", function( settings ) {
        Cookies.set('settings', settings);
        loadSettings();
    }).then(function() {
        refreshXSLTProcessors();
    }, function() {
        showAlert('A valid settings file could not be found', 'danger')
    });
}


/** Load README.md into the help tab. */
function loadHelp() {
    $.get( "README.md", function( readme ) {
        var converter = new showdown.Converter();
        var text = readme.replace(/[\s\S]+?(?=#)/, "");
        var html = converter.makeHtml(text);
        $('#help').html(html);
    });
}


$(function() {
    showLoading();
    $.ajaxSetup({ cache: false });

    // Check for required HTML5 features
    function unsupportedAlert(feature) {
        showAlert('Your browser does not support ' + feature + '. \
                   Try upgrading (Firefox 45, Chrome 45 or Safari 9 \
                   recommended).', 'danger');
        hideLoading();
    }
    if (typeof(localStorage) == 'undefined' ) {
        unsupportedAlert('HTML5 localStorage.');
    }
    if (typeof(FileReader) == 'undefined' || typeof(FileList) == 'undefined'
        || typeof(Blob) == 'undefined') {
        unsupportedAlert('the HTML5 File APIs');
    }
    if (typeof(Promise) == 'undefined') {
        unsupportedAlert('HTML5 Promises');
    }

    // Initialise settings from cookie or defaults
    if (typeof Cookies.get('settings') != "undefined") {
        loadSettings();
    } else {
        loadDefaultSettings();
    }

    loadHelp();
});
var tableXSLTProcessor, listXSLTProcessor;

/** Add XML files to local storage. */
$( "#add-files" ).change(function(evt) {
    var files = evt.target.files;
    var uniqueFilenames = $('#unique-fn > option:selected').val() == 'True';
    for (var i = 0, f; f = files[i]; i++) {
        if (f.type !== 'text/xml') {
            showAlert(f.name + ' is not a valid XML file', 'warning');
            continue;
        }
        var key = f.name;
        if (localStorage.getItem(f.name) && uniqueFilenames) {
            showAlert('A file with the name ' + f.name + ' has already \
                      been uploaded.', 'warning');
            continue;
        } else if (!uniqueFilenames) {
            key += Date.now();
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                localStorage.setItem(key, e.target.result);
            } catch (e) {
                showAlert(e, 'danger');
            }
            refreshViews();
        };
        reader.readAsText(f);
    }
});


/** Refresh the table and list views. */
function refreshViews() {
    var mergedDocs = mergeUploadedDocs();
    var tableDoc = tableXSLTProcessor.transformToFragment(mergedDocs, document);
    var listDoc = listXSLTProcessor.transformToFragment(mergedDocs, document);
    $('#table-view').html(tableDoc);
    $('#list-view').html(listDoc);
    $('#files-uploaded').html(localStorage.length + ' files uploaded');
    $('#tei-form').trigger("reset");
    enableSettings();
}


/** Enable settings certain settings if local storage is empty. */
function enableSettings() {
    if (localStorage.length == 0){
        $('#unique-fn').attr('disabled', false);
        $('#unique-fn').selectpicker('refresh');
    }
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


/** Reload XSLT processors when settings changed. */
$( ".select-xslt" ).change(function() {
    refreshXSLTProcessors();
});


/** Display a Bootstrap alert. */
function showAlert(msg, type) {
    $( "#alerts" ).load( "_alerts.html #alert-template" ,function(){
        var template = $('#alert-template').html();
        var rendered = Mustache.render(template, {msg: msg, type: type});
        $('#alert-template').remove();
        $( "#alerts" ).append(rendered);
    });
}


/** Clear local storage and refresh views. */
$( "#clear-views" ).click(function() {
    localStorage.clear();
    refreshViews();
});


/** Refresh the current XSLT processors. */
function refreshXSLTProcessors() {
    var tableXSLT = $('#select-table-xslt > option:selected').val();
    var listXSLT = $('#select-list-xslt > option:selected').val();

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
            showAlert(listXSLT + ' could not be loaded', 'danger');
        });
    }, function() {
        showAlert(tableXSLT + ' could not be loaded', 'danger');
    });
}


/** Export the data to CSV. */
$( "#csv-export" ).click(function() {
    var headers = [];
    $('#tei-table th').each(function(k, v) {
        headers.push(v.html())
    });
    var csvRows = [headers.join(',')];
    for (var i = 0; i < data.length; i++) {
        var escapedRow = [];
        for (var j = 0; j < data[i].length; j++) {
            escapedRow.push('"' + data[i][j].replace(/"/g, '""') + '"');
        }
        csvRows.push(escapedRow.join(","));
    }
    var bom = "\uFEFF";
    var csvString = bom + csvRows.join("\n");
    var encodedUri = encodeURI('data:attachment/csv;charset=utf-8,' + csvString);
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


$(function() {

    // Check for required HTML5 features
    if (typeof(localStorage) == 'undefined' ) {
        showAlert('Your browser does not support HTML5 localStorage. \
                  Try upgrading.', 'danger');
    }
    if (typeof(FileReader) == 'undefined' ) {
        showAlert('Your browser does not support the HTML5 FileReader. \
                  Try upgrading.', 'danger');
    }

    // Initialise settings
    $.getJSON( "settings.json", function( settings ) {

        // XSLT files
        $.each( settings.xsl.table, function( key, val ) {
            var html = '<option value="' + val + '">' + key + '</option>';
            $('#select-table-xslt').append(html);
        });
        $.each( settings.xsl.list, function( key, val ) {
            var html = '<option value="' + val + '">' + key + '</option>';
            $('#select-list-xslt').append(html);
        });

        // Unique filenames
        var uniqueFn = settings.uniqueFilenames.toCapsString()
        $('#unique-fn').selectpicker('val', uniqueFn);
    }).then(function() {
        $('.select-xslt').selectpicker('val', 'Default');
        $('.selectpicker').selectpicker('refresh');
        refreshXSLTProcessors();
    }, function(){
        showAlert('A valid settings file could not be found', 'danger')
    });
});
